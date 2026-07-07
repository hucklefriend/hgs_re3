<?php

namespace App\Services\MasterJson;

use App\Enums\ProductDefaultImage;
use App\Enums\Rating;
use App\Models\GamePackage;
use App\Models\GamePackageShop;
use Illuminate\Support\Facades\DB;

/**
 * パッケージ単体（パッケージ + ショップ）の
 * JSONエクスポート・差分計算・反映・新規作成を行う
 *
 * パッケージグループ・タイトルとの紐づけは対象外（既存の LinkPackageGroup 等の画面で行う）。
 * ショップはパッケージ専有のデータのため、新規作成・削除を含めて完全対応する。
 */
class PackageMasterJsonService
{
    private const SCHEMA = 'game_package';

    private const PACKAGE_FIELDS = [
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'acronym', 'label' => '略称', 'type' => 'string', 'maxlength' => 30],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'release_at', 'label' => '発売日（自由記述）', 'type' => 'string', 'required' => true, 'maxlength' => 100],
        ['key' => 'sort_order', 'label' => '表示順', 'type' => 'int'],
        ['key' => 'default_img_type', 'label' => 'デフォルト画像種別', 'type' => 'enum', 'enum' => ProductDefaultImage::class],
        ['key' => 'rating', 'label' => 'レーティング', 'type' => 'enum', 'enum' => Rating::class, 'required' => true],
        ['key' => 'game_platform_id', 'label' => 'プラットフォーム', 'type' => 'fk', 'table' => 'game_platforms', 'required' => true],
    ];

    private const PACKAGE_SHOP_FIELDS = [
        ['key' => 'shop_id', 'label' => 'ショップ', 'type' => 'enum', 'enum' => \App\Enums\Shop::class, 'required' => true],
        ['key' => 'url', 'label' => 'URL', 'type' => 'string', 'required' => true],
        ['key' => 'img_tag', 'label' => '画像タグ（HTML）', 'type' => 'text'],
        ['key' => 'param1', 'label' => 'param1', 'type' => 'string'],
        ['key' => 'param2', 'label' => 'param2', 'type' => 'string'],
        ['key' => 'param3', 'label' => 'param3', 'type' => 'string'],
    ];

    /**
     * AIに渡すJSONを生成（既存パッケージ）
     */
    public function export(GamePackage $package): array
    {
        $package->load(['shops']);

        $lock = [
            'game_package'       => $package->updated_at?->toIso8601String(),
            'game_package_shops' => [],
        ];

        $shops = [];
        foreach ($package->shops as $shop) {
            $lock['game_package_shops'][$shop->id] = $shop->updated_at?->toIso8601String();
            $shops[] = $this->exportRow(self::PACKAGE_SHOP_FIELDS, $shop);
        }

        $packageRow = $this->exportRow(self::PACKAGE_FIELDS, $package);
        $packageRow['_ref'] = array_merge($packageRow['_ref'] ?? [], ['game_platform_id_text' => $package->platform?->name]);

        return [
            '_meta' => [
                'schema'         => self::SCHEMA,
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => $lock,
            ],
            'game_package' => $packageRow,
            'shops'         => $shops,
        ];
    }

    /**
     * 新規作成用のひな形JSONを生成
     */
    public function template(): array
    {
        return [
            '_meta' => [
                'schema'         => self::SCHEMA,
                'schema_version' => 1,
                'note'           => 'これは新規作成用のひな形です。idは付けず、新規作成したいパッケージ・ショップの内容を埋めてください。',
            ],
            'game_package' => [
                'name'             => '（パッケージ名。例: Nintendo Switch版）',
                'acronym'          => '',
                'node_name'        => '',
                'release_at'       => '（発売日。自由記述）',
                'sort_order'       => 0,
                'default_img_type' => 'GAME_PACKAGE',
                'rating'           => 'None',
                'game_platform_id' => 0,
            ],
            'shops' => [
                [
                    '_op'     => 'create',
                    'shop_id' => 'Amazon',
                    'url'     => '',
                    'img_tag' => '',
                    'param1'  => '',
                    'param2'  => '',
                    'param3'  => '',
                ],
            ],
        ];
    }

    private function exportRow(array $fields, $model): array
    {
        $data = ['id' => $model->id];
        $ref = [];

        foreach ($fields as $spec) {
            $value = MasterJsonFieldHelper::normalizeCurrentValue($spec, $model->{$spec['key']});
            $data[$spec['key']] = MasterJsonFieldHelper::exportValue($spec, $value);

            if ($spec['type'] === 'enum' && $value instanceof \UnitEnum) {
                $text = MasterJsonFieldHelper::enumDisplayText($value);
                if ($text !== null) {
                    $ref["{$spec['key']}_text"] = $text;
                }
            }
        }

        if (!empty($ref)) {
            $data['_ref'] = $ref;
        }

        return $data;
    }

    /**
     * 現在のDB値と取り込みJSONを比較し差分を作る（既存パッケージ）
     */
    public function diff(GamePackage $package, string $rawJson): array
    {
        $result = [
            'errors'      => [],
            'warnings'    => [],
            'has_changes' => false,
            'package'     => null,
            'shops'       => [],
            'new_shops'   => [],
        ];

        $incoming = json_decode($rawJson, true);
        if (!is_array($incoming)) {
            $result['errors'][] = 'JSONの解析に失敗しました。形式を確認してください。';
            return $result;
        }
        if (($incoming['_meta']['schema'] ?? null) !== self::SCHEMA) {
            $result['errors'][] = 'スキーマ種別が一致しません（' . self::SCHEMA . ' が必要です）。';
            return $result;
        }
        $incomingPackage = $incoming['game_package'] ?? null;
        if (!is_array($incomingPackage) || (int) ($incomingPackage['id'] ?? 0) !== $package->id) {
            $result['errors'][] = 'パッケージIDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $package->load(['shops']);
        $lock = $incoming['_meta']['lock'] ?? [];

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_package'] ?? null, $package->updated_at);
        if ($lockConflict) {
            $result['warnings'][] = 'パッケージ本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $fields = [];
        foreach (self::PACKAGE_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $package->{$spec['key']}, $incomingPackage, $result['warnings'], 'パッケージ本体');
            if ($f !== null) {
                $fields[] = $f;
            }
        }
        $result['package'] = ['id' => $package->id, 'lock_conflict' => $lockConflict, 'fields' => $fields];
        if (!empty($fields)) {
            $result['has_changes'] = true;
        }

        $existingShopsById = $package->shops->keyBy('id');
        foreach (($incoming['shops'] ?? []) as $idx => $incomingShop) {
            $this->diffShop($incomingShop, $idx, $existingShopsById, $lock['game_package_shops'] ?? [], $result['shops'], $result['new_shops'], $result['warnings']);
        }
        if (!empty($result['shops']) || !empty($result['new_shops'])) {
            $result['has_changes'] = true;
        }

        return $result;
    }

    private function diffShop(
        mixed $incomingShop,
        int|string $idx,
        $existingShopsById,
        array $lockMap,
        array &$shopsOut,
        array &$newShopsOut,
        array &$warnings
    ): void {
        if (!is_array($incomingShop)) {
            return;
        }
        $shopOp = $incomingShop['_op'] ?? null;
        $shopId = !empty($incomingShop['id']) ? (int) $incomingShop['id'] : null;

        if ($shopId === null) {
            if ($shopOp !== 'create') {
                return;
            }
            $rowLabel = "新規ショップ（{$idx}）";
            $result = MasterJsonFieldHelper::buildCreateFields(self::PACKAGE_SHOP_FIELDS, $incomingShop, $rowLabel, $warnings);
            if ($result['invalid']) {
                $warnings[] = "{$rowLabel}: 必須項目が不足しているため無視しました。";
                return;
            }
            if (empty($result['fields'])) {
                return;
            }
            $newShopsOut[] = ['tmp_key' => (string) $idx, 'label' => $rowLabel, 'fields' => $result['fields']];
            return;
        }

        $shop = $existingShopsById->get($shopId);
        if ($shop === null) {
            $warnings[] = "ショップ #{$shopId}: 紐づいていないため無視しました。";
            return;
        }

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lockMap[$shopId] ?? null, $shop->updated_at);
        $rowLabel = 'ショップ「' . ($shop->shop()?->name() ?? $shop->shop_id) . '」';

        if ($shopOp === 'delete') {
            $shopsOut[] = ['id' => $shopId, 'op' => 'delete', 'label' => $rowLabel, 'lock_conflict' => $lockConflict, 'fields' => []];
            if ($lockConflict) {
                $warnings[] = "{$rowLabel}: エクスポート後に他で更新されています。";
            }
            return;
        }

        $shopFields = [];
        foreach (self::PACKAGE_SHOP_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $shop->{$spec['key']}, $incomingShop, $warnings, $rowLabel);
            if ($f !== null) {
                $shopFields[] = $f;
            }
        }
        if (!empty($shopFields)) {
            if ($lockConflict) {
                $warnings[] = "{$rowLabel}: エクスポート後に他で更新されています。";
            }
            $shopsOut[] = ['id' => $shopId, 'op' => 'update', 'label' => $rowLabel, 'lock_conflict' => $lockConflict, 'fields' => $shopFields];
        }
    }

    /**
     * 採用された差分のみをDBへ反映する（既存パッケージ）
     *
     * @param array $accept ['package_fields'=>[], 'shops'=>[id=>1], 'new_shops'=>["idx"=>1]]
     * @throws \Throwable
     */
    public function apply(GamePackage $package, string $rawJson, array $accept): array
    {
        $diff = $this->diff($package, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['package' => [], 'shops' => []];
        $acceptedFields = $accept['package_fields'] ?? [];
        $acceptedShops = array_map('strval', array_keys($accept['shops'] ?? []));
        $acceptedNewShops = array_map('strval', array_keys($accept['new_shops'] ?? []));

        DB::transaction(function () use ($package, $diff, $acceptedFields, $acceptedShops, $acceptedNewShops, &$applied) {
            foreach ($diff['package']['fields'] as $f) {
                if (in_array($f['key'], $acceptedFields, true)) {
                    $package->{$f['key']} = $f['raw_after'];
                    $applied['package'][] = $f;
                }
            }
            if ($package->isDirty()) {
                $package->save();
            }

            foreach ($diff['shops'] as $shopDiff) {
                if (!in_array((string) $shopDiff['id'], $acceptedShops, true)) {
                    continue;
                }
                $shop = GamePackageShop::find($shopDiff['id']);
                if ($shop === null) {
                    continue;
                }
                if ($shopDiff['op'] === 'delete') {
                    $shop->delete();
                    $applied['shops'][] = ['id' => $shopDiff['id'], 'op' => 'delete'];
                } else {
                    foreach ($shopDiff['fields'] as $f) {
                        $shop->{$f['key']} = $f['raw_after'];
                    }
                    if ($shop->isDirty()) {
                        $shop->save();
                        $applied['shops'][] = ['id' => $shopDiff['id'], 'op' => 'update', 'fields' => $shopDiff['fields']];
                    }
                }
            }

            foreach ($diff['new_shops'] as $newShop) {
                if (!in_array($newShop['tmp_key'], $acceptedNewShops, true)) {
                    continue;
                }
                $attrs = ['game_package_id' => $package->id];
                foreach ($newShop['fields'] as $f) {
                    $attrs[$f['key']] = $f['raw_after'];
                }
                GamePackageShop::create($attrs);
                $applied['shops'][] = ['op' => 'create', 'fields' => $newShop['fields']];
            }
        });

        return $applied;
    }

    /**
     * ゼロからの新規作成用の差分を作る
     */
    public function diffNew(string $rawJson): array
    {
        $result = [
            'errors'    => [],
            'warnings'  => [],
            'package'   => null,
            'new_shops' => [],
        ];

        $incoming = json_decode($rawJson, true);
        if (!is_array($incoming)) {
            $result['errors'][] = 'JSONの解析に失敗しました。形式を確認してください。';
            return $result;
        }
        if (($incoming['_meta']['schema'] ?? null) !== self::SCHEMA) {
            $result['errors'][] = 'スキーマ種別が一致しません（' . self::SCHEMA . ' が必要です）。';
            return $result;
        }
        $incomingPackage = $incoming['game_package'] ?? null;
        if (!is_array($incomingPackage)) {
            $result['errors'][] = 'game_package が見つかりません。';
            return $result;
        }

        $createResult = MasterJsonFieldHelper::buildCreateFields(self::PACKAGE_FIELDS, $incomingPackage, 'パッケージ本体', $result['warnings']);
        if ($createResult['invalid']) {
            $result['errors'][] = 'パッケージ本体: 必須項目が不足しています。';
            return $result;
        }
        $result['package'] = ['op' => 'create', 'fields' => $createResult['fields']];

        foreach (($incoming['shops'] ?? []) as $idx => $incomingShop) {
            if (!is_array($incomingShop) || ($incomingShop['_op'] ?? null) !== 'create') {
                continue;
            }
            $rowLabel = "新規ショップ（{$idx}）";
            $shopResult = MasterJsonFieldHelper::buildCreateFields(self::PACKAGE_SHOP_FIELDS, $incomingShop, $rowLabel, $result['warnings']);
            if ($shopResult['invalid']) {
                $result['warnings'][] = "{$rowLabel}: 必須項目が不足しているため無視しました。";
                continue;
            }
            if (empty($shopResult['fields'])) {
                continue;
            }
            $result['new_shops'][] = ['tmp_key' => (string) $idx, 'label' => $rowLabel, 'fields' => $shopResult['fields']];
        }

        return $result;
    }

    /**
     * ゼロからの新規作成を反映する
     *
     * @param array $accept ['package_fields'=>[], 'new_shops'=>["idx"=>1]]
     * @return array{id: int, applied: array}
     * @throws \Throwable
     */
    public function applyNew(string $rawJson, array $accept): array
    {
        $diff = $this->diffNew($rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $acceptedFields = $accept['package_fields'] ?? [];
        $acceptedNewShops = array_map('strval', array_keys($accept['new_shops'] ?? []));

        $applied = ['package' => [], 'shops' => []];
        $newPackageId = null;

        DB::transaction(function () use ($diff, $acceptedFields, $acceptedNewShops, &$applied, &$newPackageId) {
            $attrs = [];
            foreach ($diff['package']['fields'] as $f) {
                if (in_array($f['key'], $acceptedFields, true)) {
                    $attrs[$f['key']] = $f['raw_after'];
                    $applied['package'][] = $f;
                }
            }
            $package = GamePackage::create($attrs);
            $newPackageId = $package->id;

            foreach ($diff['new_shops'] as $newShop) {
                if (!in_array($newShop['tmp_key'], $acceptedNewShops, true)) {
                    continue;
                }
                $shopAttrs = ['game_package_id' => $package->id];
                foreach ($newShop['fields'] as $f) {
                    $shopAttrs[$f['key']] = $f['raw_after'];
                }
                GamePackageShop::create($shopAttrs);
                $applied['shops'][] = ['op' => 'create', 'fields' => $newShop['fields']];
            }
        });

        return ['id' => $newPackageId, 'applied' => $applied];
    }
}

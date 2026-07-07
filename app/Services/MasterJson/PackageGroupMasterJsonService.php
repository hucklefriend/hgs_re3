<?php

namespace App\Services\MasterJson;

use App\Enums\ProductDefaultImage;
use App\Enums\Rating;
use App\Models\GamePackage;
use App\Models\GamePackageGroup;
use App\Models\GamePackageShop;
use Illuminate\Support\Facades\DB;

/**
 * パッケージグループ単体（パッケージグループ + パッケージ + ショップ）の
 * JSONエクスポート・差分計算・反映・新規作成を行う
 *
 * タイトルとの紐づけは対象外（既存の LinkTitle / LinkPackageGroup 画面で行う）。
 * パッケージは他のパッケージグループと共有され得るため、"_op":"delete" は実体の削除ではなく
 * 「このグループからの関連解除」として扱う。
 * パッケージの新規作成（既存グループへの追加・新規グループ作成時の同時作成）に対応する。
 * ショップはパッケージ専有のデータのため、新規作成・削除を含めて完全対応する。
 */
class PackageGroupMasterJsonService
{
    private const SCHEMA = 'game_package_group';

    private const PACKAGE_GROUP_FIELDS = [
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'sort_order', 'label' => '表示順', 'type' => 'int'],
        ['key' => 'description', 'label' => '説明文', 'type' => 'text'],
        ['key' => 'description_source', 'label' => '説明文の引用元', 'type' => 'text'],
        ['key' => 'simple_shop_text', 'label' => '簡易ショップ表記', 'type' => 'text'],
    ];

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
     * AIに渡すJSONを生成（既存グループ）
     */
    public function export(GamePackageGroup $group): array
    {
        $group->load(['packages.shops', 'packages.platform']);

        $lock = [
            'game_package_group' => $group->updated_at?->toIso8601String(),
            'game_packages'      => [],
            'game_package_shops' => [],
        ];

        $packages = [];
        foreach ($group->packages as $package) {
            $lock['game_packages'][$package->id] = $package->updated_at?->toIso8601String();

            $shops = [];
            foreach ($package->shops as $shop) {
                $lock['game_package_shops'][$shop->id] = $shop->updated_at?->toIso8601String();
                $shops[] = $this->exportShopRow($shop);
            }

            $packages[] = $this->exportPackageRow($package, $shops);
        }

        return [
            '_meta' => [
                'schema'         => self::SCHEMA,
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => $lock,
            ],
            'game_package_group' => $this->exportGroupRow($group),
            'packages'            => $packages,
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
                'note'           => 'これは新規作成用のひな形です。idは付けず、新規作成したいパッケージグループ・パッケージ・ショップの内容を埋めてください。',
            ],
            'game_package_group' => [
                'name'               => '（パッケージグループ名）',
                'node_name'          => '（ノード表示用の名前）',
                'sort_order'         => 0,
                'description'       => '',
                'description_source' => '',
                'simple_shop_text'   => '',
            ],
            'packages' => [
                [
                    '_op'              => 'create',
                    'name'             => '（パッケージ名。例: Nintendo Switch版）',
                    'acronym'          => '',
                    'node_name'        => '',
                    'release_at'       => '（発売日。自由記述）',
                    'sort_order'       => 0,
                    'default_img_type' => 'GAME_PACKAGE',
                    'rating'           => 'None',
                    'game_platform_id' => 0,
                    'shops'            => [
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
                ],
            ],
        ];
    }

    /**
     * 1レコード分をJSON出力用配列に変換する
     */
    private function exportGroupRow(GamePackageGroup $group): array
    {
        return $this->exportRow(self::PACKAGE_GROUP_FIELDS, $group);
    }

    private function exportPackageRow(GamePackage $package, array $shops): array
    {
        $data = $this->exportRow(self::PACKAGE_FIELDS, $package);
        $data['_ref'] = array_merge($data['_ref'] ?? [], ['game_platform_id_text' => $package->platform?->name]);
        $data['shops'] = $shops;
        return $data;
    }

    private function exportShopRow(GamePackageShop $shop): array
    {
        return $this->exportRow(self::PACKAGE_SHOP_FIELDS, $shop);
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
     * 現在のDB値と取り込みJSONを比較し差分を作る（既存グループ）
     */
    public function diff(GamePackageGroup $group, string $rawJson): array
    {
        $result = [
            'errors'      => [],
            'warnings'    => [],
            'has_changes' => false,
            'package_group' => null,
            'packages'    => [],
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
        $incomingGroup = $incoming['game_package_group'] ?? null;
        if (!is_array($incomingGroup) || (int) ($incomingGroup['id'] ?? 0) !== $group->id) {
            $result['errors'][] = 'パッケージグループIDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $group->load(['packages.shops']);
        $lock = $incoming['_meta']['lock'] ?? [];

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_package_group'] ?? null, $group->updated_at);
        if ($lockConflict) {
            $result['warnings'][] = 'パッケージグループ本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $fields = [];
        foreach (self::PACKAGE_GROUP_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $group->{$spec['key']}, $incomingGroup, $result['warnings'], 'パッケージグループ本体');
            if ($f !== null) {
                $fields[] = $f;
            }
        }
        $result['package_group'] = ['id' => $group->id, 'lock_conflict' => $lockConflict, 'fields' => $fields];
        if (!empty($fields)) {
            $result['has_changes'] = true;
        }

        $existingPackagesById = $group->packages->keyBy('id');
        foreach (($incoming['packages'] ?? []) as $idx => $incomingPackage) {
            $packageDiff = $this->diffPackage($incomingPackage, $idx, $existingPackagesById, $lock, $result['warnings']);
            if ($packageDiff !== null) {
                $result['packages'][] = $packageDiff;
                $result['has_changes'] = true;
            }
        }

        return $result;
    }

    private function diffPackage(mixed $incomingPackage, int|string $idx, $existingPackagesById, array $lock, array &$warnings): ?array
    {
        if (!is_array($incomingPackage)) {
            return null;
        }

        $op = $incomingPackage['_op'] ?? null;
        $packageId = !empty($incomingPackage['id']) ? (int) $incomingPackage['id'] : null;

        if ($packageId === null) {
            if ($op !== 'create') {
                return null;
            }
            return $this->diffNewPackage($incomingPackage, $idx, $warnings);
        }

        $package = $existingPackagesById->get($packageId);
        if ($package === null) {
            $warnings[] = "パッケージ #{$packageId}: このグループに紐づいていないため無視しました。";
            return null;
        }

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_packages'][$packageId] ?? null, $package->updated_at);
        $rowLabel = "パッケージ「{$package->name}」";

        $packageDiff = [
            'id'            => $packageId,
            'op'            => null,
            'label'         => $package->name,
            'lock_conflict' => $lockConflict,
            'fields'        => [],
            'shops'         => [],
            'new_shops'     => [],
        ];

        if ($op === 'delete') {
            $packageDiff['op'] = 'unlink';
        } else {
            foreach (self::PACKAGE_FIELDS as $spec) {
                $f = MasterJsonFieldHelper::diffField($spec, $package->{$spec['key']}, $incomingPackage, $warnings, $rowLabel);
                if ($f !== null) {
                    $packageDiff['fields'][] = $f;
                }
            }
            if (!empty($packageDiff['fields'])) {
                $packageDiff['op'] = 'update';
            }
        }

        if ($lockConflict && $packageDiff['op'] !== null) {
            $warnings[] = "{$rowLabel}: エクスポート後に他で更新されています。";
        }

        $existingShopsById = $package->shops->keyBy('id');
        foreach (($incomingPackage['shops'] ?? []) as $shopIdx => $incomingShop) {
            $this->diffShop($incomingShop, $shopIdx, $existingShopsById, $lock['game_package_shops'] ?? [], $packageDiff['shops'], $packageDiff['new_shops'], $warnings);
        }

        if ($packageDiff['op'] === null && empty($packageDiff['shops']) && empty($packageDiff['new_shops'])) {
            return null;
        }

        return $packageDiff;
    }

    /**
     * 新規パッケージ（既存グループへの追加）の差分を構築する
     */
    private function diffNewPackage(array $incomingPackage, int|string $idx, array &$warnings): ?array
    {
        $rowLabel = "新規パッケージ（{$idx}）";
        $result = MasterJsonFieldHelper::buildCreateFields(self::PACKAGE_FIELDS, $incomingPackage, $rowLabel, $warnings);
        if ($result['invalid']) {
            $warnings[] = "{$rowLabel}: 必須項目が不足しているため無視しました。";
            return null;
        }
        if (empty($result['fields'])) {
            return null;
        }

        $newShops = [];
        $emptyShops = [];
        foreach (($incomingPackage['shops'] ?? []) as $shopIdx => $incomingShop) {
            $this->diffShop($incomingShop, $shopIdx, collect(), [], $emptyShops, $newShops, $warnings);
        }

        return [
            'id'            => null,
            'op'            => 'create',
            'label'         => $rowLabel,
            'lock_conflict' => false,
            'tmp_key'       => (string) $idx,
            'fields'        => $result['fields'],
            'shops'         => [],
            'new_shops'     => $newShops,
        ];
    }

    /**
     * ショップ（1:N、専有データ）の差分を計算する。create/update/deleteすべてに対応
     */
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
     * 採用された差分のみをDBへ反映する（既存グループ）
     *
     * @param array $accept ['package_group_fields'=>[], 'packages'=>[id|tmpKey=>1], 'package_shops'=>[id=>1], 'new_package_shops'=>["pkgId|tmpKey:idx"=>1]]
     * @throws \Throwable
     */
    public function apply(GamePackageGroup $group, string $rawJson, array $accept): array
    {
        $diff = $this->diff($group, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['package_group' => [], 'packages' => []];
        $acceptedGroupFields = $accept['package_group_fields'] ?? [];
        $acceptedPackages = array_map('strval', array_keys($accept['packages'] ?? []));
        $acceptedShops = array_map('strval', array_keys($accept['package_shops'] ?? []));
        $acceptedNewShops = array_map('strval', array_keys($accept['new_package_shops'] ?? []));

        DB::transaction(function () use ($group, $diff, $acceptedGroupFields, $acceptedPackages, $acceptedShops, $acceptedNewShops, &$applied) {
            foreach ($diff['package_group']['fields'] as $f) {
                if (in_array($f['key'], $acceptedGroupFields, true)) {
                    $group->{$f['key']} = $f['raw_after'];
                    $applied['package_group'][] = $f;
                }
            }
            if ($group->isDirty()) {
                $group->save();
            }

            foreach ($diff['packages'] as $packageDiff) {
                $packageApplied = $this->applyPackage($group, $packageDiff, $acceptedPackages, $acceptedShops, $acceptedNewShops);
                if ($packageApplied !== null) {
                    $applied['packages'][] = $packageApplied;
                }
            }
        });

        return $applied;
    }

    private function applyPackage(GamePackageGroup $group, array $packageDiff, array $acceptedPackages, array $acceptedShops, array $acceptedNewShops): ?array
    {
        $key = $packageDiff['op'] === 'create' ? $packageDiff['tmp_key'] : (string) $packageDiff['id'];
        $accepted = in_array($key, $acceptedPackages, true);

        if ($packageDiff['op'] === 'create') {
            if (!$accepted) {
                return null;
            }
            $attrs = [];
            foreach ($packageDiff['fields'] as $f) {
                $attrs[$f['key']] = $f['raw_after'];
            }
            $package = GamePackage::create($attrs);
            $group->packages()->attach($package->id);
            $packageApplied = ['id' => $package->id, 'op' => 'create', 'fields' => $packageDiff['fields'], 'shops' => []];

            foreach ($packageDiff['new_shops'] as $newShop) {
                $tmpKey = $packageDiff['tmp_key'] . ':' . $newShop['tmp_key'];
                if (!in_array($tmpKey, $acceptedNewShops, true)) {
                    continue;
                }
                $shopAttrs = ['game_package_id' => $package->id];
                foreach ($newShop['fields'] as $f) {
                    $shopAttrs[$f['key']] = $f['raw_after'];
                }
                GamePackageShop::create($shopAttrs);
                $packageApplied['shops'][] = ['op' => 'create', 'fields' => $newShop['fields']];
            }

            return $packageApplied;
        }

        $packageApplied = ['id' => $packageDiff['id'], 'op' => null, 'fields' => [], 'shops' => []];

        if ($packageDiff['op'] === 'unlink' && $accepted) {
            $group->packages()->detach($packageDiff['id']);
            $packageApplied['op'] = 'unlink';
        } elseif ($packageDiff['op'] === 'update' && $accepted) {
            $package = GamePackage::find($packageDiff['id']);
            if ($package !== null) {
                foreach ($packageDiff['fields'] as $f) {
                    $package->{$f['key']} = $f['raw_after'];
                }
                if ($package->isDirty()) {
                    $package->save();
                    $packageApplied['op'] = 'update';
                    $packageApplied['fields'] = $packageDiff['fields'];
                }
            }
        }

        foreach ($packageDiff['shops'] as $shopDiff) {
            if (!in_array((string) $shopDiff['id'], $acceptedShops, true)) {
                continue;
            }
            $shop = GamePackageShop::find($shopDiff['id']);
            if ($shop === null) {
                continue;
            }
            if ($shopDiff['op'] === 'delete') {
                $shop->delete();
                $packageApplied['shops'][] = ['id' => $shopDiff['id'], 'op' => 'delete'];
            } else {
                foreach ($shopDiff['fields'] as $f) {
                    $shop->{$f['key']} = $f['raw_after'];
                }
                if ($shop->isDirty()) {
                    $shop->save();
                    $packageApplied['shops'][] = ['id' => $shopDiff['id'], 'op' => 'update', 'fields' => $shopDiff['fields']];
                }
            }
        }

        foreach ($packageDiff['new_shops'] as $newShop) {
            $tmpKey = $packageDiff['id'] . ':' . $newShop['tmp_key'];
            if (!in_array($tmpKey, $acceptedNewShops, true)) {
                continue;
            }
            $attrs = ['game_package_id' => $packageDiff['id']];
            foreach ($newShop['fields'] as $f) {
                $attrs[$f['key']] = $f['raw_after'];
            }
            GamePackageShop::create($attrs);
            $packageApplied['shops'][] = ['op' => 'create', 'fields' => $newShop['fields']];
        }

        if ($packageApplied['op'] === null && empty($packageApplied['shops'])) {
            return null;
        }

        return $packageApplied;
    }

    /**
     * ゼロからの新規作成用の差分を作る
     */
    public function diffNew(string $rawJson): array
    {
        $result = [
            'errors'        => [],
            'warnings'      => [],
            'package_group' => null,
            'packages'      => [],
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
        $incomingGroup = $incoming['game_package_group'] ?? null;
        if (!is_array($incomingGroup)) {
            $result['errors'][] = 'game_package_group が見つかりません。';
            return $result;
        }

        $createResult = MasterJsonFieldHelper::buildCreateFields(self::PACKAGE_GROUP_FIELDS, $incomingGroup, 'パッケージグループ本体', $result['warnings']);
        if ($createResult['invalid']) {
            $result['errors'][] = 'パッケージグループ本体: 必須項目が不足しています。';
            return $result;
        }
        $result['package_group'] = ['op' => 'create', 'fields' => $createResult['fields']];

        foreach (($incoming['packages'] ?? []) as $idx => $incomingPackage) {
            if (!is_array($incomingPackage) || ($incomingPackage['_op'] ?? null) !== 'create') {
                $result['warnings'][] = "パッケージ（{$idx}）: 新規作成（_op:create）以外はこのフローでは対象外のため無視しました。";
                continue;
            }
            $packageDiff = $this->diffNewPackage($incomingPackage, $idx, $result['warnings']);
            if ($packageDiff !== null) {
                $result['packages'][] = $packageDiff;
            }
        }

        return $result;
    }

    /**
     * ゼロからの新規作成を反映する
     *
     * @param array $accept ['package_group_fields'=>[], 'packages'=>[tmpKey=>1], 'new_package_shops'=>["tmpKey:idx"=>1]]
     * @return array{id: int, applied: array}
     * @throws \Throwable
     */
    public function applyNew(string $rawJson, array $accept): array
    {
        $diff = $this->diffNew($rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $acceptedGroupFields = $accept['package_group_fields'] ?? [];
        $acceptedPackages = array_map('strval', array_keys($accept['packages'] ?? []));
        $acceptedNewShops = array_map('strval', array_keys($accept['new_package_shops'] ?? []));

        $applied = ['package_group' => [], 'packages' => []];
        $newGroupId = null;

        DB::transaction(function () use ($diff, $acceptedGroupFields, $acceptedPackages, $acceptedNewShops, &$applied, &$newGroupId) {
            $attrs = [];
            foreach ($diff['package_group']['fields'] as $f) {
                if (in_array($f['key'], $acceptedGroupFields, true)) {
                    $attrs[$f['key']] = $f['raw_after'];
                    $applied['package_group'][] = $f;
                }
            }
            $group = GamePackageGroup::create($attrs);
            $newGroupId = $group->id;

            foreach ($diff['packages'] as $packageDiff) {
                $packageApplied = $this->applyPackage($group, $packageDiff, $acceptedPackages, [], $acceptedNewShops);
                if ($packageApplied !== null) {
                    $applied['packages'][] = $packageApplied;
                }
            }
        });

        return ['id' => $newGroupId, 'applied' => $applied];
    }
}

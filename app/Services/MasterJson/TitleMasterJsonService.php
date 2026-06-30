<?php

namespace App\Services\MasterJson;

use App\Enums\Rating;
use App\Models\GamePackage;
use App\Models\GamePackageGroup;
use App\Models\GamePackageShop;
use App\Models\GameTitle;
use Illuminate\Support\Facades\DB;

/**
 * ゲームタイトル集約（タイトル本体 + パッケージグループ + パッケージ + ショップ）の
 * JSONエクスポート・差分計算・反映を行う
 *
 * パッケージグループ／パッケージは他タイトルと共有され得るため、
 * "_op":"delete" は実体の削除ではなく「このタイトル（グループ）からの関連解除」として扱う。
 * パッケージグループ／パッケージの新規作成はこの機能では未対応（既存IDの指定が必須）。
 * ショップはタイトル専有のデータのため、新規作成・削除を含めて完全対応する。
 */
class TitleMasterJsonService
{
    private const TITLE_FIELDS = [
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'phonetic', 'label' => 'よみがな', 'type' => 'string', 'required' => true, 'maxlength' => 200, 'regex' => '/^[あ-ん][ぁ-んー0-9]*$/u'],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'description', 'label' => '説明文', 'type' => 'text'],
        ['key' => 'description_source', 'label' => '説明文の引用元', 'type' => 'text'],
        ['key' => 'rating', 'label' => 'レーティング', 'type' => 'enum', 'enum' => Rating::class, 'required' => true],
        ['key' => 'issue', 'label' => '疑義', 'type' => 'text'],
        ['key' => 'search_synonyms', 'label' => '検索用シノニム', 'type' => 'text'],
    ];

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
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'maxlength' => 200],
        ['key' => 'release_at', 'label' => '発売日（自由記述）', 'type' => 'string', 'required' => true, 'maxlength' => 100],
        ['key' => 'sort_order', 'label' => '表示順', 'type' => 'int'],
        ['key' => 'default_img_type', 'label' => 'デフォルト画像種別', 'type' => 'enum', 'enum' => \App\Enums\ProductDefaultImage::class],
        ['key' => 'rating', 'label' => 'レーティング', 'type' => 'enum', 'enum' => Rating::class, 'required' => true],
        ['key' => 'game_platform_id', 'label' => 'プラットフォーム', 'type' => 'fk', 'table' => 'game_platforms'],
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
     * AIに渡すJSONを生成
     */
    public function export(GameTitle $title): array
    {
        $title->load(['packageGroups.packages.shops', 'packageGroups.packages.platform']);

        $lock = [
            'game_title'          => $title->updated_at?->toIso8601String(),
            'game_package_groups' => [],
            'game_packages'       => [],
            'game_package_shops'  => [],
        ];

        $packageGroups = [];
        foreach ($title->packageGroups as $group) {
            $lock['game_package_groups'][$group->id] = $group->updated_at?->toIso8601String();

            $packages = [];
            foreach ($group->packages as $package) {
                $lock['game_packages'][$package->id] = $package->updated_at?->toIso8601String();

                $shops = [];
                foreach ($package->shops as $shop) {
                    $lock['game_package_shops'][$shop->id] = $shop->updated_at?->toIso8601String();
                    $shops[] = $this->exportRow(self::PACKAGE_SHOP_FIELDS, $shop, []);
                }

                $packages[] = $this->exportRow(self::PACKAGE_FIELDS, $package, [
                    'game_platform_id' => ['platform_name' => $package->platform?->name],
                ], ['shops' => $shops]);
            }

            $packageGroups[] = $this->exportRow(self::PACKAGE_GROUP_FIELDS, $group, [], ['packages' => $packages]);
        }

        return [
            '_meta' => [
                'schema'         => 'game_title',
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => $lock,
            ],
            'game_title'     => $this->exportRow(self::TITLE_FIELDS, $title, []),
            'package_groups' => $packageGroups,
        ];
    }

    /**
     * 1レコード分をJSON出力用配列に変換する
     */
    private function exportRow(array $fields, $model, array $refResolvers, array $extra = []): array
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
            if (isset($refResolvers[$spec['key']])) {
                $ref = array_merge($ref, $refResolvers[$spec['key']]);
            }
        }

        if (!empty($ref)) {
            $data['_ref'] = $ref;
        }

        return array_merge($data, $extra);
    }

    /**
     * 現在のDB値と取り込みJSONを比較し差分を作る
     */
    public function diff(GameTitle $title, string $rawJson): array
    {
        $result = [
            'errors'       => [],
            'warnings'     => [],
            'has_changes'  => false,
            'title'        => null,
            'package_groups' => [],
        ];

        $incoming = json_decode($rawJson, true);
        if (!is_array($incoming)) {
            $result['errors'][] = 'JSONの解析に失敗しました。形式を確認してください。';
            return $result;
        }
        if (($incoming['_meta']['schema'] ?? null) !== 'game_title') {
            $result['errors'][] = 'スキーマ種別が一致しません（game_title が必要です）。';
            return $result;
        }
        $incomingTitle = $incoming['game_title'] ?? null;
        if (!is_array($incomingTitle) || (int) ($incomingTitle['id'] ?? 0) !== $title->id) {
            $result['errors'][] = 'タイトルIDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $title->load(['packageGroups.packages.shops']);
        $lock = $incoming['_meta']['lock'] ?? [];

        $titleLockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_title'] ?? null, $title->updated_at);
        if ($titleLockConflict) {
            $result['warnings'][] = 'タイトル本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $titleFields = [];
        foreach (self::TITLE_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $title->{$spec['key']}, $incomingTitle, $result['warnings'], 'タイトル本体');
            if ($f !== null) {
                $titleFields[] = $f;
            }
        }
        $result['title'] = ['id' => $title->id, 'lock_conflict' => $titleLockConflict, 'fields' => $titleFields];
        if (!empty($titleFields)) {
            $result['has_changes'] = true;
        }

        $existingGroupsById = $title->packageGroups->keyBy('id');
        foreach (($incoming['package_groups'] ?? []) as $incomingGroup) {
            $groupDiff = $this->diffGroup($incomingGroup, $existingGroupsById, $lock, $result['warnings']);
            if ($groupDiff !== null) {
                $result['package_groups'][] = $groupDiff;
                $result['has_changes'] = true;
            }
        }

        return $result;
    }

    private function diffGroup(mixed $incomingGroup, $existingGroupsById, array $lock, array &$warnings): ?array
    {
        if (!is_array($incomingGroup) || empty($incomingGroup['id'])) {
            return null;
        }
        $groupId = (int) $incomingGroup['id'];
        $group = $existingGroupsById->get($groupId);
        if ($group === null) {
            $warnings[] = "パッケージグループ #{$groupId}: このタイトルに紐づいていないため無視しました。";
            return null;
        }

        $op = $incomingGroup['_op'] ?? null;
        if ($op === 'create') {
            $warnings[] = "パッケージグループ「{$group->name}」: 新規作成はこの機能では未対応です。パッケージグループ詳細画面の「JSONから新規作成」をご利用ください。";
            $op = null;
        }

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_package_groups'][$groupId] ?? null, $group->updated_at);
        $rowLabel = "パッケージグループ「{$group->name}」";

        $groupDiff = [
            'id'            => $groupId,
            'op'            => null,
            'label'         => $group->name,
            'lock_conflict' => $lockConflict,
            'fields'        => [],
            'packages'      => [],
        ];

        if ($op === 'delete') {
            $groupDiff['op'] = 'unlink';
        } else {
            foreach (self::PACKAGE_GROUP_FIELDS as $spec) {
                $f = MasterJsonFieldHelper::diffField($spec, $group->{$spec['key']}, $incomingGroup, $warnings, $rowLabel);
                if ($f !== null) {
                    $groupDiff['fields'][] = $f;
                }
            }
            if (!empty($groupDiff['fields'])) {
                $groupDiff['op'] = 'update';
            }
        }

        if ($lockConflict && $groupDiff['op'] !== null) {
            $warnings[] = "{$rowLabel}: エクスポート後に他で更新されています。";
        }

        $existingPackagesById = $group->packages->keyBy('id');
        foreach (($incomingGroup['packages'] ?? []) as $incomingPackage) {
            $packageDiff = $this->diffPackage($incomingPackage, $existingPackagesById, $lock, $warnings);
            if ($packageDiff !== null) {
                $groupDiff['packages'][] = $packageDiff;
            }
        }

        if ($groupDiff['op'] === null && empty($groupDiff['packages'])) {
            return null;
        }

        return $groupDiff;
    }

    private function diffPackage(mixed $incomingPackage, $existingPackagesById, array $lock, array &$warnings): ?array
    {
        if (!is_array($incomingPackage) || empty($incomingPackage['id'])) {
            return null;
        }
        $packageId = (int) $incomingPackage['id'];
        $package = $existingPackagesById->get($packageId);
        if ($package === null) {
            $warnings[] = "パッケージ #{$packageId}: このグループに紐づいていないため無視しました。";
            return null;
        }

        $op = $incomingPackage['_op'] ?? null;
        if ($op === 'create') {
            $warnings[] = "パッケージ「{$package->name}」: 新規作成はこの機能では未対応です。";
            $op = null;
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
        foreach (($incomingPackage['shops'] ?? []) as $idx => $incomingShop) {
            $this->diffShop(
                self::PACKAGE_SHOP_FIELDS,
                $incomingShop,
                $idx,
                $existingShopsById,
                $lock['game_package_shops'] ?? [],
                $packageDiff['shops'],
                $packageDiff['new_shops'],
                $warnings,
                fn ($shop) => 'ショップ「' . ($shop->shop()?->name() ?? $shop->shop_id) . '」'
            );
        }

        if ($packageDiff['op'] === null && empty($packageDiff['shops']) && empty($packageDiff['new_shops'])) {
            return null;
        }

        return $packageDiff;
    }

    /**
     * ショップ（1:N、専有データ）の差分を計算する。create/update/deleteすべてに対応
     */
    private function diffShop(
        array $fieldSpecs,
        mixed $incomingShop,
        int|string $idx,
        $existingShopsById,
        array $lockMap,
        array &$shopsOut,
        array &$newShopsOut,
        array &$warnings,
        \Closure $labelResolver
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
            $result = MasterJsonFieldHelper::buildCreateFields($fieldSpecs, $incomingShop, $rowLabel, $warnings);
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
        $rowLabel = $labelResolver($shop);

        if ($shopOp === 'delete') {
            $shopsOut[] = ['id' => $shopId, 'op' => 'delete', 'label' => $rowLabel, 'lock_conflict' => $lockConflict, 'fields' => []];
            if ($lockConflict) {
                $warnings[] = "{$rowLabel}: エクスポート後に他で更新されています。";
            }
            return;
        }

        $shopFields = [];
        foreach ($fieldSpecs as $spec) {
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
     * 採用された差分のみをDBへ反映する
     *
     * @param array $accept ['title_fields'=>[], 'package_groups'=>[id=>1], 'packages'=>[id=>1], 'package_shops'=>[id=>1], 'new_package_shops'=>["pkgId:idx"=>1]]
     * @return array 実際に適用された差分（監査ログ用）
     * @throws \Throwable
     */
    public function apply(GameTitle $title, string $rawJson, array $accept): array
    {
        $diff = $this->diff($title, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['title' => [], 'package_groups' => []];
        $acceptedTitleFields = $accept['title_fields'] ?? [];
        $acceptedGroups = array_map('strval', array_keys($accept['package_groups'] ?? []));
        $acceptedPackages = array_map('strval', array_keys($accept['packages'] ?? []));
        $acceptedShops = array_map('strval', array_keys($accept['package_shops'] ?? []));
        $acceptedNewShops = array_map('strval', array_keys($accept['new_package_shops'] ?? []));

        DB::transaction(function () use ($title, $diff, $acceptedTitleFields, $acceptedGroups, $acceptedPackages, $acceptedShops, $acceptedNewShops, &$applied) {
            foreach ($diff['title']['fields'] as $f) {
                if (in_array($f['key'], $acceptedTitleFields, true)) {
                    $title->{$f['key']} = $f['raw_after'];
                    $applied['title'][] = $f;
                }
            }
            if ($title->isDirty()) {
                $title->save();
            }

            foreach ($diff['package_groups'] as $groupDiff) {
                $groupApplied = $this->applyGroup($title, $groupDiff, $acceptedGroups, $acceptedPackages, $acceptedShops, $acceptedNewShops);
                if ($groupApplied !== null) {
                    $applied['package_groups'][] = $groupApplied;
                }
            }

            $title->setFirstReleaseInt()->save();
            $franchise = $title->getFranchise();
            if ($franchise !== null) {
                $franchise->setTitleParam();
                $franchise->save();
            }
            $series = $title->series;
            if ($series !== null) {
                $series->setTitleParam();
                $series->save();
            }
        });

        return $applied;
    }

    private function applyGroup(GameTitle $title, array $groupDiff, array $acceptedGroups, array $acceptedPackages, array $acceptedShops, array $acceptedNewShops): ?array
    {
        $groupApplied = ['id' => $groupDiff['id'], 'op' => null, 'fields' => [], 'packages' => []];
        $accepted = in_array((string) $groupDiff['id'], $acceptedGroups, true);

        if ($groupDiff['op'] === 'unlink' && $accepted) {
            $title->packageGroups()->detach($groupDiff['id']);
            $groupApplied['op'] = 'unlink';
        } elseif ($groupDiff['op'] === 'update' && $accepted) {
            $group = GamePackageGroup::find($groupDiff['id']);
            if ($group !== null) {
                foreach ($groupDiff['fields'] as $f) {
                    $group->{$f['key']} = $f['raw_after'];
                }
                if ($group->isDirty()) {
                    $group->save();
                    $groupApplied['op'] = 'update';
                    $groupApplied['fields'] = $groupDiff['fields'];
                }
            }
        }

        foreach ($groupDiff['packages'] as $packageDiff) {
            $packageApplied = $this->applyPackage($groupDiff['id'], $packageDiff, $acceptedPackages, $acceptedShops, $acceptedNewShops);
            if ($packageApplied !== null) {
                $groupApplied['packages'][] = $packageApplied;
            }
        }

        if ($groupApplied['op'] === null && empty($groupApplied['packages'])) {
            return null;
        }

        return $groupApplied;
    }

    private function applyPackage(int $groupId, array $packageDiff, array $acceptedPackages, array $acceptedShops, array $acceptedNewShops): ?array
    {
        $packageApplied = ['id' => $packageDiff['id'], 'op' => null, 'fields' => [], 'shops' => []];
        $accepted = in_array((string) $packageDiff['id'], $acceptedPackages, true);

        if ($packageDiff['op'] === 'unlink' && $accepted) {
            $group = GamePackageGroup::find($groupId);
            $group?->packages()->detach($packageDiff['id']);
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
}

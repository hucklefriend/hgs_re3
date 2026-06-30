<?php

namespace App\Services\MasterJson;

use App\Enums\ProductDefaultImage;
use App\Enums\Rating;
use App\Models\GameRelatedProduct;
use App\Models\GameRelatedProductShop;
use Illuminate\Support\Facades\DB;

/**
 * 関連商品単体（関連商品 + ショップ）の
 * JSONエクスポート・差分計算・反映・新規作成を行う
 *
 * タイトル・メディアミックス・プラットフォームとの紐づけは対象外
 * （既存の LinkTitle / LinkMediaMix / LinkPlatform 画面で行う）。
 * ショップは関連商品専有のデータのため、新規作成・削除を含めて完全対応する。
 */
class RelatedProductMasterJsonService
{
    private const SCHEMA = 'game_related_product';

    private const RELATED_PRODUCT_FIELDS = [
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'description', 'label' => '説明文', 'type' => 'text'],
        ['key' => 'description_source', 'label' => '説明文の引用元', 'type' => 'text'],
        ['key' => 'rating', 'label' => 'レーティング', 'type' => 'enum', 'enum' => Rating::class, 'required' => true],
        ['key' => 'default_img_type', 'label' => 'デフォルト画像種別', 'type' => 'enum', 'enum' => ProductDefaultImage::class, 'required' => true],
        ['key' => 'sort_order', 'label' => '表示順', 'type' => 'int'],
    ];

    private const RELATED_PRODUCT_SHOP_FIELDS = [
        ['key' => 'shop_id', 'label' => 'ショップ', 'type' => 'enum', 'enum' => \App\Enums\Shop::class, 'required' => true],
        ['key' => 'subtitle', 'label' => 'サブタイトル', 'type' => 'string'],
        ['key' => 'url', 'label' => 'URL', 'type' => 'string', 'required' => true],
        ['key' => 'img_tag', 'label' => '画像タグ（HTML）', 'type' => 'text'],
        ['key' => 'param1', 'label' => 'param1', 'type' => 'string'],
        ['key' => 'param2', 'label' => 'param2', 'type' => 'string'],
    ];

    /**
     * AIに渡すJSONを生成（既存関連商品）
     */
    public function export(GameRelatedProduct $relatedProduct): array
    {
        $relatedProduct->load(['shops']);

        $lock = [
            'game_related_product'       => $relatedProduct->updated_at?->toIso8601String(),
            'game_related_product_shops' => [],
        ];

        $shops = [];
        foreach ($relatedProduct->shops as $shop) {
            $lock['game_related_product_shops'][$shop->id] = $shop->updated_at?->toIso8601String();
            $shops[] = $this->exportRow(self::RELATED_PRODUCT_SHOP_FIELDS, $shop);
        }

        return [
            '_meta' => [
                'schema'         => self::SCHEMA,
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => $lock,
            ],
            'game_related_product' => $this->exportRow(self::RELATED_PRODUCT_FIELDS, $relatedProduct),
            'shops'                 => $shops,
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
                'note'           => 'これは新規作成用のひな形です。idは付けず、新規作成したい関連商品・ショップの内容を埋めてください。',
            ],
            'game_related_product' => [
                'name'               => '（関連商品名）',
                'node_name'          => '（ノード表示用の名前）',
                'description'       => '',
                'description_source' => '',
                'rating'             => 'None',
                'default_img_type'   => 'GAME_PACKAGE',
                'sort_order'         => 0,
            ],
            'shops' => [
                [
                    '_op'      => 'create',
                    'shop_id'  => 'Amazon',
                    'subtitle' => '',
                    'url'      => '',
                    'img_tag'  => '',
                    'param1'   => '',
                    'param2'   => '',
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
     * 現在のDB値と取り込みJSONを比較し差分を作る（既存関連商品）
     */
    public function diff(GameRelatedProduct $relatedProduct, string $rawJson): array
    {
        $result = [
            'errors'        => [],
            'warnings'      => [],
            'has_changes'   => false,
            'related_product' => null,
            'shops'         => [],
            'new_shops'     => [],
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
        $incomingProduct = $incoming['game_related_product'] ?? null;
        if (!is_array($incomingProduct) || (int) ($incomingProduct['id'] ?? 0) !== $relatedProduct->id) {
            $result['errors'][] = '関連商品IDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $relatedProduct->load(['shops']);
        $lock = $incoming['_meta']['lock'] ?? [];

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_related_product'] ?? null, $relatedProduct->updated_at);
        if ($lockConflict) {
            $result['warnings'][] = '関連商品本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $fields = [];
        foreach (self::RELATED_PRODUCT_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $relatedProduct->{$spec['key']}, $incomingProduct, $result['warnings'], '関連商品本体');
            if ($f !== null) {
                $fields[] = $f;
            }
        }
        $result['related_product'] = ['id' => $relatedProduct->id, 'lock_conflict' => $lockConflict, 'fields' => $fields];
        if (!empty($fields)) {
            $result['has_changes'] = true;
        }

        $existingShopsById = $relatedProduct->shops->keyBy('id');
        foreach (($incoming['shops'] ?? []) as $idx => $incomingShop) {
            $this->diffShop($incomingShop, $idx, $existingShopsById, $lock['game_related_product_shops'] ?? [], $result['shops'], $result['new_shops'], $result['warnings']);
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
            $result = MasterJsonFieldHelper::buildCreateFields(self::RELATED_PRODUCT_SHOP_FIELDS, $incomingShop, $rowLabel, $warnings);
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
        foreach (self::RELATED_PRODUCT_SHOP_FIELDS as $spec) {
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
     * 採用された差分のみをDBへ反映する（既存関連商品）
     *
     * @param array $accept ['related_product_fields'=>[], 'shops'=>[id=>1], 'new_shops'=>["idx"=>1]]
     * @throws \Throwable
     */
    public function apply(GameRelatedProduct $relatedProduct, string $rawJson, array $accept): array
    {
        $diff = $this->diff($relatedProduct, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['related_product' => [], 'shops' => []];
        $acceptedFields = $accept['related_product_fields'] ?? [];
        $acceptedShops = array_map('strval', array_keys($accept['shops'] ?? []));
        $acceptedNewShops = array_map('strval', array_keys($accept['new_shops'] ?? []));

        DB::transaction(function () use ($relatedProduct, $diff, $acceptedFields, $acceptedShops, $acceptedNewShops, &$applied) {
            foreach ($diff['related_product']['fields'] as $f) {
                if (in_array($f['key'], $acceptedFields, true)) {
                    $relatedProduct->{$f['key']} = $f['raw_after'];
                    $applied['related_product'][] = $f;
                }
            }
            if ($relatedProduct->isDirty()) {
                $relatedProduct->save();
            }

            foreach ($diff['shops'] as $shopDiff) {
                if (!in_array((string) $shopDiff['id'], $acceptedShops, true)) {
                    continue;
                }
                $shop = GameRelatedProductShop::find($shopDiff['id']);
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
                $attrs = ['game_related_product_id' => $relatedProduct->id];
                foreach ($newShop['fields'] as $f) {
                    $attrs[$f['key']] = $f['raw_after'];
                }
                GameRelatedProductShop::create($attrs);
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
            'errors'          => [],
            'warnings'        => [],
            'related_product' => null,
            'new_shops'       => [],
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
        $incomingProduct = $incoming['game_related_product'] ?? null;
        if (!is_array($incomingProduct)) {
            $result['errors'][] = 'game_related_product が見つかりません。';
            return $result;
        }

        $createResult = MasterJsonFieldHelper::buildCreateFields(self::RELATED_PRODUCT_FIELDS, $incomingProduct, '関連商品本体', $result['warnings']);
        if ($createResult['invalid']) {
            $result['errors'][] = '関連商品本体: 必須項目が不足しています。';
            return $result;
        }
        $result['related_product'] = ['op' => 'create', 'fields' => $createResult['fields']];

        foreach (($incoming['shops'] ?? []) as $idx => $incomingShop) {
            if (!is_array($incomingShop) || ($incomingShop['_op'] ?? null) !== 'create') {
                continue;
            }
            $rowLabel = "新規ショップ（{$idx}）";
            $shopResult = MasterJsonFieldHelper::buildCreateFields(self::RELATED_PRODUCT_SHOP_FIELDS, $incomingShop, $rowLabel, $result['warnings']);
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
     * @param array $accept ['related_product_fields'=>[], 'new_shops'=>["idx"=>1]]
     * @return array{id: int, applied: array}
     * @throws \Throwable
     */
    public function applyNew(string $rawJson, array $accept): array
    {
        $diff = $this->diffNew($rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $acceptedFields = $accept['related_product_fields'] ?? [];
        $acceptedNewShops = array_map('strval', array_keys($accept['new_shops'] ?? []));

        $applied = ['related_product' => [], 'shops' => []];
        $newProductId = null;

        DB::transaction(function () use ($diff, $acceptedFields, $acceptedNewShops, &$applied, &$newProductId) {
            $attrs = [];
            foreach ($diff['related_product']['fields'] as $f) {
                if (in_array($f['key'], $acceptedFields, true)) {
                    $attrs[$f['key']] = $f['raw_after'];
                    $applied['related_product'][] = $f;
                }
            }
            $relatedProduct = GameRelatedProduct::create($attrs);
            $newProductId = $relatedProduct->id;

            foreach ($diff['new_shops'] as $newShop) {
                if (!in_array($newShop['tmp_key'], $acceptedNewShops, true)) {
                    continue;
                }
                $shopAttrs = ['game_related_product_id' => $relatedProduct->id];
                foreach ($newShop['fields'] as $f) {
                    $shopAttrs[$f['key']] = $f['raw_after'];
                }
                GameRelatedProductShop::create($shopAttrs);
                $applied['shops'][] = ['op' => 'create', 'fields' => $newShop['fields']];
            }
        });

        return ['id' => $newProductId, 'applied' => $applied];
    }
}

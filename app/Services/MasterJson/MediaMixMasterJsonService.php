<?php

namespace App\Services\MasterJson;

use App\Enums\ProductDefaultImage;
use App\Enums\Rating;
use App\Enums\Shop;
use App\Models\GameMediaMix;
use App\Models\GameRelatedProduct;
use App\Models\GameRelatedProductShop;
use Illuminate\Support\Facades\DB;

/**
 * メディアミックス集約（メディアミックス本体 + 関連商品 + ショップ）の
 * JSONエクスポート・差分計算・反映を行う
 *
 * 関連商品は他のメディアミックス／タイトルと共有され得るため、
 * "_op":"delete" は実体の削除ではなく「このメディアミックスからの関連解除」として扱う。
 * 関連商品の新規作成はこの機能では未対応（既存IDの指定が必須）。
 * ショップは関連商品専有のデータのため、新規作成・削除を含めて完全対応する。
 */
class MediaMixMasterJsonService
{
    private const MEDIA_MIX_FIELDS = [
        ['key' => 'type', 'label' => '種別', 'type' => 'enum', 'enum' => \App\Enums\MediaMixType::class, 'required' => true],
        ['key' => 'name', 'label' => '名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'node_name', 'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
        ['key' => 'rating', 'label' => 'レーティング', 'type' => 'enum', 'enum' => Rating::class, 'required' => true],
        ['key' => 'sort_order', 'label' => '表示順', 'type' => 'int'],
        ['key' => 'description', 'label' => '説明文', 'type' => 'text'],
        ['key' => 'description_source', 'label' => '説明文の引用元', 'type' => 'text'],
    ];

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
        ['key' => 'shop_id', 'label' => 'ショップ', 'type' => 'enum', 'enum' => Shop::class, 'required' => true],
        ['key' => 'subtitle', 'label' => 'サブタイトル', 'type' => 'string'],
        ['key' => 'url', 'label' => 'URL', 'type' => 'string', 'required' => true],
        ['key' => 'img_tag', 'label' => '画像タグ（HTML）', 'type' => 'text'],
        ['key' => 'param1', 'label' => 'param1', 'type' => 'string'],
        ['key' => 'param2', 'label' => 'param2', 'type' => 'string'],
    ];

    /**
     * AIに渡すJSONを生成
     */
    public function export(GameMediaMix $mediaMix): array
    {
        $mediaMix->load(['relatedProducts.shops']);

        $lock = [
            'game_media_mix'             => $mediaMix->updated_at?->toIso8601String(),
            'game_related_products'      => [],
            'game_related_product_shops' => [],
        ];

        $relatedProducts = [];
        foreach ($mediaMix->relatedProducts as $relatedProduct) {
            $lock['game_related_products'][$relatedProduct->id] = $relatedProduct->updated_at?->toIso8601String();

            $shops = [];
            foreach ($relatedProduct->shops as $shop) {
                $lock['game_related_product_shops'][$shop->id] = $shop->updated_at?->toIso8601String();
                $shops[] = $this->exportRow(self::RELATED_PRODUCT_SHOP_FIELDS, $shop);
            }

            $relatedProducts[] = $this->exportRow(self::RELATED_PRODUCT_FIELDS, $relatedProduct, ['shops' => $shops]);
        }

        return [
            '_meta' => [
                'schema'         => 'game_media_mix',
                'schema_version' => 1,
                'exported_at'    => now()->toIso8601String(),
                'lock'           => $lock,
            ],
            'game_media_mix'   => $this->exportRow(self::MEDIA_MIX_FIELDS, $mediaMix),
            'related_products' => $relatedProducts,
        ];
    }

    /**
     * 1レコード分をJSON出力用配列に変換する
     */
    private function exportRow(array $fields, $model, array $extra = []): array
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

        return array_merge($data, $extra);
    }

    /**
     * 現在のDB値と取り込みJSONを比較し差分を作る
     */
    public function diff(GameMediaMix $mediaMix, string $rawJson): array
    {
        $result = [
            'errors'           => [],
            'warnings'         => [],
            'has_changes'      => false,
            'media_mix'        => null,
            'related_products' => [],
        ];

        $incoming = json_decode($rawJson, true);
        if (!is_array($incoming)) {
            $result['errors'][] = 'JSONの解析に失敗しました。形式を確認してください。';
            return $result;
        }
        if (($incoming['_meta']['schema'] ?? null) !== 'game_media_mix') {
            $result['errors'][] = 'スキーマ種別が一致しません（game_media_mix が必要です）。';
            return $result;
        }
        $incomingMediaMix = $incoming['game_media_mix'] ?? null;
        if (!is_array($incomingMediaMix) || (int) ($incomingMediaMix['id'] ?? 0) !== $mediaMix->id) {
            $result['errors'][] = 'メディアミックスIDが一致しません。エクスポートしたJSONを編集してください。';
            return $result;
        }

        $mediaMix->load(['relatedProducts.shops']);
        $lock = $incoming['_meta']['lock'] ?? [];

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_media_mix'] ?? null, $mediaMix->updated_at);
        if ($lockConflict) {
            $result['warnings'][] = 'メディアミックス本体: エクスポート後に他で更新されています。内容を確認してください。';
        }

        $fields = [];
        foreach (self::MEDIA_MIX_FIELDS as $spec) {
            $f = MasterJsonFieldHelper::diffField($spec, $mediaMix->{$spec['key']}, $incomingMediaMix, $result['warnings'], 'メディアミックス本体');
            if ($f !== null) {
                $fields[] = $f;
            }
        }
        $result['media_mix'] = ['id' => $mediaMix->id, 'lock_conflict' => $lockConflict, 'fields' => $fields];
        if (!empty($fields)) {
            $result['has_changes'] = true;
        }

        $existingProductsById = $mediaMix->relatedProducts->keyBy('id');
        foreach (($incoming['related_products'] ?? []) as $incomingProduct) {
            $productDiff = $this->diffRelatedProduct($incomingProduct, $existingProductsById, $lock, $result['warnings']);
            if ($productDiff !== null) {
                $result['related_products'][] = $productDiff;
                $result['has_changes'] = true;
            }
        }

        return $result;
    }

    private function diffRelatedProduct(mixed $incomingProduct, $existingProductsById, array $lock, array &$warnings): ?array
    {
        if (!is_array($incomingProduct) || empty($incomingProduct['id'])) {
            return null;
        }
        $productId = (int) $incomingProduct['id'];
        $product = $existingProductsById->get($productId);
        if ($product === null) {
            $warnings[] = "関連商品 #{$productId}: このメディアミックスに紐づいていないため無視しました。";
            return null;
        }

        $op = $incomingProduct['_op'] ?? null;
        if ($op === 'create') {
            $warnings[] = "関連商品「{$product->name}」: 新規作成はこの機能では未対応です。関連商品詳細画面の「JSONから新規作成」をご利用ください。";
            $op = null;
        }

        $lockConflict = MasterJsonFieldHelper::isLockConflict($lock['game_related_products'][$productId] ?? null, $product->updated_at);
        $rowLabel = "関連商品「{$product->name}」";

        $productDiff = [
            'id'            => $productId,
            'op'            => null,
            'label'         => $product->name,
            'lock_conflict' => $lockConflict,
            'fields'        => [],
            'shops'         => [],
            'new_shops'     => [],
        ];

        if ($op === 'delete') {
            $productDiff['op'] = 'unlink';
        } else {
            foreach (self::RELATED_PRODUCT_FIELDS as $spec) {
                $f = MasterJsonFieldHelper::diffField($spec, $product->{$spec['key']}, $incomingProduct, $warnings, $rowLabel);
                if ($f !== null) {
                    $productDiff['fields'][] = $f;
                }
            }
            if (!empty($productDiff['fields'])) {
                $productDiff['op'] = 'update';
            }
        }

        if ($lockConflict && $productDiff['op'] !== null) {
            $warnings[] = "{$rowLabel}: エクスポート後に他で更新されています。";
        }

        $existingShopsById = $product->shops->keyBy('id');
        foreach (($incomingProduct['shops'] ?? []) as $idx => $incomingShop) {
            $this->diffShop($incomingShop, $idx, $existingShopsById, $lock['game_related_product_shops'] ?? [], $productDiff['shops'], $productDiff['new_shops'], $warnings);
        }

        if ($productDiff['op'] === null && empty($productDiff['shops']) && empty($productDiff['new_shops'])) {
            return null;
        }

        return $productDiff;
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
     * 採用された差分のみをDBへ反映する
     *
     * @param array $accept ['media_mix_fields'=>[], 'related_products'=>[id=>1], 'product_shops'=>[id=>1], 'new_product_shops'=>["productId:idx"=>1]]
     * @return array 実際に適用された差分（監査ログ用）
     * @throws \Throwable
     */
    public function apply(GameMediaMix $mediaMix, string $rawJson, array $accept): array
    {
        $diff = $this->diff($mediaMix, $rawJson);
        if (!empty($diff['errors'])) {
            throw new \RuntimeException(implode(' / ', $diff['errors']));
        }

        $applied = ['media_mix' => [], 'related_products' => []];
        $acceptedMediaMixFields = $accept['media_mix_fields'] ?? [];
        $acceptedProducts = array_map('strval', array_keys($accept['related_products'] ?? []));
        $acceptedShops = array_map('strval', array_keys($accept['product_shops'] ?? []));
        $acceptedNewShops = array_map('strval', array_keys($accept['new_product_shops'] ?? []));

        DB::transaction(function () use ($mediaMix, $diff, $acceptedMediaMixFields, $acceptedProducts, $acceptedShops, $acceptedNewShops, &$applied) {
            foreach ($diff['media_mix']['fields'] as $f) {
                if (in_array($f['key'], $acceptedMediaMixFields, true)) {
                    $mediaMix->{$f['key']} = $f['raw_after'];
                    $applied['media_mix'][] = $f;
                }
            }
            if ($mediaMix->isDirty()) {
                $mediaMix->save();
            }

            foreach ($diff['related_products'] as $productDiff) {
                $productApplied = $this->applyRelatedProduct($mediaMix, $productDiff, $acceptedProducts, $acceptedShops, $acceptedNewShops);
                if ($productApplied !== null) {
                    $applied['related_products'][] = $productApplied;
                }
            }
        });

        return $applied;
    }

    private function applyRelatedProduct(GameMediaMix $mediaMix, array $productDiff, array $acceptedProducts, array $acceptedShops, array $acceptedNewShops): ?array
    {
        $productApplied = ['id' => $productDiff['id'], 'op' => null, 'fields' => [], 'shops' => []];
        $accepted = in_array((string) $productDiff['id'], $acceptedProducts, true);

        if ($productDiff['op'] === 'unlink' && $accepted) {
            $mediaMix->relatedProducts()->detach($productDiff['id']);
            $productApplied['op'] = 'unlink';
        } elseif ($productDiff['op'] === 'update' && $accepted) {
            $product = GameRelatedProduct::find($productDiff['id']);
            if ($product !== null) {
                foreach ($productDiff['fields'] as $f) {
                    $product->{$f['key']} = $f['raw_after'];
                }
                if ($product->isDirty()) {
                    $product->save();
                    $productApplied['op'] = 'update';
                    $productApplied['fields'] = $productDiff['fields'];
                }
            }
        }

        foreach ($productDiff['shops'] as $shopDiff) {
            if (!in_array((string) $shopDiff['id'], $acceptedShops, true)) {
                continue;
            }
            $shop = GameRelatedProductShop::find($shopDiff['id']);
            if ($shop === null) {
                continue;
            }
            if ($shopDiff['op'] === 'delete') {
                $shop->delete();
                $productApplied['shops'][] = ['id' => $shopDiff['id'], 'op' => 'delete'];
            } else {
                foreach ($shopDiff['fields'] as $f) {
                    $shop->{$f['key']} = $f['raw_after'];
                }
                if ($shop->isDirty()) {
                    $shop->save();
                    $productApplied['shops'][] = ['id' => $shopDiff['id'], 'op' => 'update', 'fields' => $shopDiff['fields']];
                }
            }
        }

        foreach ($productDiff['new_shops'] as $newShop) {
            $tmpKey = $productDiff['id'] . ':' . $newShop['tmp_key'];
            if (!in_array($tmpKey, $acceptedNewShops, true)) {
                continue;
            }
            $attrs = ['game_related_product_id' => $productDiff['id']];
            foreach ($newShop['fields'] as $f) {
                $attrs[$f['key']] = $f['raw_after'];
            }
            GameRelatedProductShop::create($attrs);
            $productApplied['shops'][] = ['op' => 'create', 'fields' => $newShop['fields']];
        }

        if ($productApplied['op'] === null && empty($productApplied['shops'])) {
            return null;
        }

        return $productApplied;
    }
}

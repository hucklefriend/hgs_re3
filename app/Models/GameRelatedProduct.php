<?php

namespace App\Models;

use App\Enums\ProductDefaultImage;
use App\Enums\Rating;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameRelatedProduct extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];
    protected $casts = [
        'rating'           => Rating::class,
        'default_img_type' => ProductDefaultImage::class,
    ];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'name'             => '',
        'rating'           => Rating::None,
        'sort_order'       => 0,
        'default_img_type' => ProductDefaultImage::GAME_PACKAGE,
    ];

    /**
     * プラットフォームを取得
     *
     * @return BelongsToMany
     */
    public function platforms(): BelongsToMany
    {
        return $this->belongsToMany(GamePlatform::class, GamePlatformRelatedProductLink::class);
    }

    /**
     * タイトルを取得
     *
     * @return BelongsToMany
     */
    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class, GameTitleRelatedProductLink::class);
    }

    /**
     * メディアミックスを取得
     *
     * @return BelongsToMany
     */
    public function mediaMixes(): BelongsToMany
    {
        return $this->belongsToMany(GameMediaMix::class, GameMediaMixRelatedProductLink::class);
    }

    /**
     * ショップを取得
     *
     * @return HasMany
     */
    public function shops(): HasMany
    {
        return $this->hasMany(GameRelatedProductShop::class, 'game_related_product_id', 'id');
    }

    /**
     * 画像表示用ショップ
     *
     * @return BelongsTo
     */
    public function imgShop(): BelongsTo
    {
        return $this->belongsTo(GameRelatedProductShop::class, 'img_shop_id');
    }

    /**
     * 選択用ショップリストを取得
     *
     * @return string[]
     */
    public function getSelectShopList(): array
    {
        $shops = $this->shops;
        $shopList = ['' => '--'];
        foreach ($shops as $shop) {
            $shopList[$shop->id] = $shop->shop()->name;
        }
        return $shopList;
    }

    /**
     * 削除
     *
     * @return bool|null
     */
    public function delete(): bool|null
    {
        /* @var GameRelatedProductShop $shop */
        foreach ($this->shops as $shop) {
            // ショップ情報も削除
            $shop->delete();
        }

        return parent::delete();
    }
}

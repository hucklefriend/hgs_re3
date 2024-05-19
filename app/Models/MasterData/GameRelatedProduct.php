<?php

namespace App\Models\MasterData;

use App\Enums\Rating;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameRelatedProduct extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];
    protected $casts = [
        'rating' => Rating::class,
    ];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'name'   => '',
        'rating' => Rating::None,
    ];

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

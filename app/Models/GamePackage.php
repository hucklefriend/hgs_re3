<?php

namespace App\Models;

use App\Enums\ProductDefaultImage;
use App\Enums\Rating;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class GamePackage extends Model
{
    protected $guarded = ['id'];
    protected $casts = [
        'rating'           => Rating::class,
        'default_img_type' => ProductDefaultImage::class,
    ];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'rating'           => Rating::None,
        'default_img_type' => ProductDefaultImage::GAME_PACKAGE,
        'sort_order'       => 0,
    ];


    /**
     * メーカー
     *
     * @return BelongsToMany
     */
    public function makers(): BelongsToMany
    {
        return $this->belongsToMany(GameMaker::class, GameMakerPackageLink::class);
    }

    /**
     * メーカーIDを取得
     *
     * @return array
     */
    public function makerIds(): array
    {
        return $this->makers->pluck('id')->toArray();
    }

    /**
     * プラットフォームを取得
     *
     * @return BelongsTo
     */
    public function platform(): BelongsTo
    {
        return $this->belongsTo(GamePlatform::class, 'game_platform_id');
    }

    /**
     * プラットフォームIDを取得
     *
     * @return array
     */
    public function platformIds(): array
    {
        return [$this->game_platform_id];
    }

    /**
     * パッケージグループを取得
     *
     * @return BelongsToMany
     */
    public function packageGroups(): BelongsToMany
    {
        return $this->belongsToMany(GamePackageGroup::class, GamePackageGroupPackageLink::class);
    }

    /**
     * プラットフォーム名とセットの名称を取得
     *
     * @return string
     */
    public function getNameWithPlatform(): string
    {
        return sprintf('%s (%s)', $this->name, $this->platform->acronym ?? '');
    }

    /**
     * ショップを取得
     *
     * @return HasMany
     */
    public function shops(): HasMany
    {
        return $this->hasMany(GamePackageShop::class, 'game_package_id', 'id');
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
        /* @var GamePackageShop $shop */
        foreach ($this->shops as $shop) {
            // ショップ情報も削除
            $shop->delete();
        }

        return parent::delete();
    }
}

<?php

namespace App\Models;

use App\Enums\Shop;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GamePackageShop extends \Eloquent
{
    use OgpTrait;

    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @return ?Shop
     */
    public function shop(): ?Shop
    {
        return Shop::tryFrom($this->shop_id);
    }

    /**
     * パッケージ
     *
     * @return BelongsTo
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(GamePackage::class, 'game_package_id');
    }
}

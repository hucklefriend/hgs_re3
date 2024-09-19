<?php

namespace App\Models;

use App\Enums\Shop;

class GameRelatedProductShop extends \Eloquent
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
}

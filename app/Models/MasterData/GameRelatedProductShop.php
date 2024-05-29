<?php

namespace App\Models\MasterData;

use App\Enums\Game\Shop;

class GameRelatedProductShop extends \Eloquent
{
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

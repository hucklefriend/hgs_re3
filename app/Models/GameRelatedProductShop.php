<?php

namespace App\Models;

use App\Enums\Shop;
use App\Models\Extensions\OgpTrait;
use Illuminate\Database\Eloquent\Model;

class GameRelatedProductShop extends Model
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

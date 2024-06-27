<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GamePlatformRelatedProductLink extends \Eloquent
{
    protected $primaryKey = ['game_platform_id', 'game_related_product_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * プラットフォーム
     *
     * @return BelongsTo
     */
    public function platform(): BelongsTo
    {
        return $this->belongsTo(GamePlatform::class);
    }

    /**
     * 関連商品
     *
     * @return BelongsTo
     */
    public function relatedProduct(): BelongsTo
    {
        return $this->belongsTo(GameRelatedProduct::class);
    }
}

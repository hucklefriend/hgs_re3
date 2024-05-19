<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameTitleRelatedProductLink extends \Eloquent
{
    protected $primaryKey = ['game_title_id', 'game_related_product_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * タイトル
     *
     * @return BelongsTo
     */
    public function title(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class);
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameMediaMixRelatedProductLink extends \Eloquent
{
    protected $primaryKey = ['game_media_mix_id', 'game_related_product_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * メディアミックス
     *
     * @return BelongsTo
     */
    public function mediaMix(): BelongsTo
    {
        return $this->belongsTo(GameMediaMix::class);
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

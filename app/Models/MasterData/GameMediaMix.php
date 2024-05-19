<?php

namespace App\Models\MasterData;

use App\Enums\MediaMixType;
use App\Enums\Rating;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GameMediaMix extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];
    protected $casts = [
        'type'   => MediaMixType::class,
        'rating' => Rating::class,
    ];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'type'         => MediaMixType::MOVIE,
        'name'         => '',
        'node_name'    => '',
        'h1_node_name' => '',
        'rating'       => Rating::None,
    ];

    /**
     * フランチャイズを取得
     *
     * @return BelongsTo
     */
    public function franchise(): BelongsTo
    {
        return $this->belongsTo(GameFranchise::class, 'game_franchise_id');
    }

    /**
     * 関連商品
     *
     * @return BelongsToMany
     */
    public function relatedProducts(): BelongsToMany
    {
        return $this->belongsToMany(GameRelatedProduct::class, GameMediaMixRelatedProductLink::class);
    }
}

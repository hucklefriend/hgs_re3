<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GamePlatform extends Model
{
    protected $guarded = ['id'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'sort_order' => 0
    ];


    /**
     * メーカーを取得
     *
     * @return BelongsTo
     */
    public function maker(): BelongsTo
    {
        return $this->belongsTo(GameMaker::class, 'maker_id');
    }
}

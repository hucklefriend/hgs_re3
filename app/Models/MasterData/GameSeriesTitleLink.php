<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameSeriesTitleLink extends Model
{
    protected $primaryKey = ['game_series_id', 'game_title_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * シリーズ
     *
     * @return BelongsTo
     */
    public function series(): BelongsTo
    {
        return $this->belongsTo(GameSeries::class);
    }

    /**
     * タイトル
     *
     * @return BelongsTo
     */
    public function title(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class);
    }
}

<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameSeriesTitleLinks extends Model
{
    protected $primaryKey = ['game_series_id', 'game_title_id'];
    public $incrementing = false;

    public function series(): BelongsTo
    {
        return $this->belongsTo(GameSeries::class);
    }

    public function title(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class);
    }
}

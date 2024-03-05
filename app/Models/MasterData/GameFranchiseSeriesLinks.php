<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameFranchiseSeriesLinks extends Model
{
    protected $primaryKey = ['game_franchise_id', 'game_series_id'];
    public $incrementing = false;

    public function franchise(): BelongsTo
    {
        return $this->belongsTo(GameFranchise::class);
    }

    public function series(): BelongsTo
    {
        return $this->belongsTo(GameSeries::class);
    }
}

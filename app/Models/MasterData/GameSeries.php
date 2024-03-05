<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameSeries extends \Eloquent
{
    protected $guarded = ['id'];

    /**
     * フランチャイズ
     *
     * @return HasOneThrough
     */
    public function franchise(): HasOneThrough
    {
        return $this->hasOneThrough(GameFranchise::class, GameFranchiseSeriesLinks::class);
    }

    /**
     * タイトル
     *
     * @return HasManyThrough
     */
    public function titles(): HasManyThrough
    {
        return $this->hasManyThrough(GameTitle::class, GameSeriesTitleLinks::class);
    }
}

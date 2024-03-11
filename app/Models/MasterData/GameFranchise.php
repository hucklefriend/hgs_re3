<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GameFranchise extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'name'        => '',
        'phonetic'    => '',
    ];

    /**
     * シリーズ
     *
     * @return BelongsToMany
     */
    public function series(): BelongsToMany
    {
        return $this->belongsToMany(GameSeries::class, GameFranchiseSeriesLink::class);
    }

    /**
     * タイトル
     *
     * @return BelongsToMany
     */
    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class, GameFranchiseTitleLink::class);
    }
}

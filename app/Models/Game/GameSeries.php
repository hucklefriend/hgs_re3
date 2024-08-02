<?php

namespace App\Models\Game;

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
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * フランチャイズ
     *
     * @return ?GameFranchise
     */
    public function franchise(): ?GameFranchise
    {
        // 1対多だが、中間テーブルを利用しているためこうした
        $many =  $this->belongsToMany(GameFranchise::class, GameFranchiseSeriesLink::class);
        return $many->count() == 0 ? null : $many->first();
    }

    /**
     * タイトル
     *
     * @return BelongsToMany
     */
    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class, GameSeriesTitleLink::class);
    }

    /**
     * 前のシリーズを取得
     *
     * @return self
     */
    public function prev(): self
    {
        $prev = self::where('id', '<', $this->id)->orderBy('id', 'desc')->first();
        if ($prev !== null) {
            return $prev;
        } else {
            // idが最大のデータを取得
            return self::orderBy('id', 'desc')->first();
        }
    }

    /**
     * 次のシリーズを取得
     *
     * @return self
     */
    public function next(): self
    {
        $next = self::where('id', '>', $this->id)->orderBy('id', 'asc')->first();
        if ($next !== null) {
            return $next;
        } else {
            // idが最小のデータを取得
            return self::orderBy('id', 'asc')->first();
        }
    }
}

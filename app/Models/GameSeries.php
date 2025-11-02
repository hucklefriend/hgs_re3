<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class GameSeries extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * フランチャイズ
     *
     * @return BelongsTo
     */
    public function franchise(): BelongsTo
    {
        return $this->belongsTo(GameFranchise::class, 'game_franchise_id');
    }

    /**
     * タイトル
     *
     * @return HasMany
     */
    public function titles(): HasMany
    {
        return $this->HasMany(GameTitle::class, 'game_series_id');
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

    /**
     * タイトルから設定するパラメーター
     *
     * @return self
     */
    public function setTitleParam(): self
    {
        $this->first_release_int = 99999999;
        foreach ($this->titles as $title) {
            if ($title->first_release_int < $this->first_release_int) {
                $this->first_release_int = $title->first_release_int;
            }
        }

        return $this;
    }
}

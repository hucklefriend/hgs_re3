<?php

namespace App\Models;

use App\Models\Extensions\KeyFindTrait;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GameFranchise extends \Eloquent
{
    use KeyFindTrait;

    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'name'     => '',
        'phonetic' => '',
    ];

    /**
     * シリーズ
     *
     * @return HasMany
     */
    public function series(): HasMany
    {
        return $this->hasMany(GameSeries::class, 'game_franchise_id');
    }

    /**
     * タイトル
     *
     * @return HasMany
     */
    public function titles(): HasMany
    {
        return $this->hasMany(GameTitle::class, 'game_franchise_id');
    }

    /**
     * メディアミックスグループ
     *
     * @return HasMany
     */
    public function mediaMixGroups(): HasMany
    {
        return $this->hasMany(GameMediaMixGroup::class);
    }

    /**
     * メディアミックス
     *
     * @return HasMany
     */
    public function mediaMixes(): HasMany
    {
        return $this->hasMany(GameMediaMix::class);
    }

    /**
     * メインネットワーク
     *
     * @return HasOne
     */
    public function mainNetwork(): HasOne
    {
        return $this->hasOne(GameMainNetworkFranchise::class);
    }

    /**
     * 前のフランチャイズを取得
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
     * 次のフランチャイズを取得
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
     * タイトル数を取得
     *
     * @return int
     */
    public function getTitleNum(): int
    {
        $num = 0;

        $this->series()->each(function (GameSeries $series) use (&$num) {
            $num += $series->titles()->count();
        });

        $num += $this->titles()->count();

        return $num;
    }
}

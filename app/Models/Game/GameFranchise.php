<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GameFranchise extends \Eloquent
{
    use KeyFindTrait;

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

    /**
     * メディアミックスグループ
     *
     * @return BelongsToMany
     */
    public function mediaMixGroups(): BelongsToMany
    {
        return $this->belongsToMany(GameMediaMixGroup::class, GameFranchiseMediaMixGroupLink::class);
    }

    /**
     * メディアミックス
     *
     * @return BelongsToMany
     */
    public function mediaMixes(): BelongsToMany
    {
        return $this->belongsToMany(GameMediaMix::class, GameFranchiseMediaMixLink::class);
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

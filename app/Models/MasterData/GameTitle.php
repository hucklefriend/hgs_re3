<?php
/**
 * ORM: game_softs
 */

namespace App\Models\MasterData;

use App\Enums\RatedR;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class GameTitle extends \Eloquent
{
    protected $guarded = ['id'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'genre' => '',
    ];

    /**
     * フランチャイズを取得
     *
     * @return ?GameFranchise
     */
    public function franchise(): ?GameFranchise
    {
        if ($this->series()) {
            return $this->series()->first()->franchise();
        } else {
            $hasOneThrough = $this->hasOneThrough(GameFranchise::class, GameFranchiseTitleLinks::class,
                'game_title_id', 'id', 'id', 'game_franchise_id');
            if ($hasOneThrough) {
                return $hasOneThrough->first();
            }
        }

        return null;
    }

    /**
     * シリーズを取得
     *
     * @return HasOneThrough
     */
    public function series(): HasOneThrough
    {
        return $this->hasOneThrough(GameSeries::class, GameSeriesTitleLinks::class,
            'game_title_id', 'id', 'id', 'game_series_id');
    }

    /**
     * 原点のパッケージを取得
     *
     * @return HasOne
     */
    public function originalPackage(): HasOne
    {
        return $this->hasOne(GamePackage::class, 'id', 'original_package_id');
    }

    /**
     * パッケージを取得
     *
     * @return BelongsToMany
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(GamePackage::class, GameTitlePackageLinks::class);
    }
}

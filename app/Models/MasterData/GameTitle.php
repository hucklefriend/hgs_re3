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
     * @return HasOneThrough
     */
    public function franchise(): HasOneThrough
    {
        return $this->hasOneThrough(GameFranchise::class, GameFranchiseTitleLinks::class);
    }

    /**
     * シリーズを取得
     *
     * @return HasOneThrough
     */
    public function series(): HasOneThrough
    {
        return $this->hasOneThrough(GameSeries::class, GameSeriesTitleLinks::class);
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
     * @return HasManyThrough
     */
    public function packages(): HasManyThrough
    {
        return $this->hasManyThrough(GamePackage::class, GameTitlePackageLinks::class);
    }

    /**
     * 保存
     *
     * @param array $options
     * @return bool
     */
    public function save(array $options = []): bool
    {
        $this->phonetic_type = PhoneticType::getTypeByPhonetic($this->phonetic);

        if ($this->packages()->count() === 0) {
            $this->original_package_id = null;
            $this->first_release_int = 0;
            $this->r18_only_flag = 0;
        } else {
            $this->r18_only_flag = 1;

            /* @var GamePackage $package */
            foreach ($this->packages as $package) {
                // 一番古い発売日をセット
                if ($this->first_release_int == 0) {
                    $this->first_release_int = $package->release_int;
                } else if ($this->first_release_int < $package->release_int) {
                    $this->first_release_int = $package->release_int;
                }

                // R18以外が1つでもあればフラグを下げる
                if ($package->rated_r != RatedR::R18->value) {
                    $this->r18_only_flag = 0;
                }
            }
        }

        $this->genre ??= '';
        $this->introduction ??= '';
        $this->introduction_from ??= '';

        return parent::save($options);
    }

    /**
     * パッケージ画像があるパッケージを取得
     */
    public function getImagePackage()
    {
        $packages = $this->getPackages();
        if ($packages->count() == 0) {
            return null;
        }

        foreach ($packages as $pkg) {
            if (!empty(small_image_url($pkg))) {
                return $pkg;
            }
        }

        return null;
    }

    /**
     * パッケージを取得
     *
     * @param bool $all
     * @return Collection
     */
    public function getPackages(bool $all = false): Collection
    {
        $packageLinks = GameSoftPackage::where('soft_id', $this->id)->get();
        if ($packageLinks->isEmpty()) {
            return new Collection();
        }

        $packages = GamePackage::whereIn('id', $packageLinks->pluck('package_id'));
        if (!$all) {
            $packages->where('release_int', '<=', date('Ymd'));
        }

        return $packages->orderBy('release_int')->get();
    }

    /**
     * 発売済みか？
     *
     * @return bool
     */
    public function isReleased(): bool
    {
        return $this->first_release_int <= date('Ymd');
    }

    /**
     * 現在設定されているパッケージ群から原点パッケージの設定
     *
     * @return void
     */
    public function setOriginalPackage(): void
    {
        $packages = $this->getPackages();
        if ($packages->isEmpty()) {
            $this->original_package_id = null;
        } else {
            $this->original_package_id = $packages[0]->id;
            $this->first_release_int = $packages[0]->release_int;
        }
    }
}

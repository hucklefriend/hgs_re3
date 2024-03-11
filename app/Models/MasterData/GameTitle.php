<?php

namespace App\Models\MasterData;

use App\Enums\RatedR;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class GameTitle extends \Eloquent
{
    protected $guarded = ['id', 'synonymsStr'];
    protected $hidden = ['created_at', 'updated_at'];

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
            return $this->series()->franchise();
        } else {
            $hasOneThrough = $this->hasOneThrough(GameFranchise::class, GameFranchiseTitleLink::class,
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
     * @return ?GameSeries
     */
    public function series(): ?GameSeries
    {
        $hasOneThrough =  $this->hasOneThrough(GameSeries::class, GameSeriesTitleLink::class,
            'game_title_id', 'id', 'id', 'game_series_id');
        if ($hasOneThrough) {
            return $hasOneThrough->first();
        }

        return null;
    }

    /**
     * @var string 俗称の改行区切り文字列
     */
    public string $synonymsStr = '';

    public function synonyms(): HasMany
    {
        return $this->hasMany(GameTitleSynonym::class, 'game_title_id');
    }

    /**
     * 俗称の読み取り
     *
     * @return void
     */
    public function loadSynonyms(): void
    {
        $this->synonymsStr = $this->synonyms()->pluck('synonym')->implode("\r\n");
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
        return $this->belongsToMany(GamePackage::class, GameTitlePackageLink::class);
    }

    /**
     * 保存
     *
     * @throws \Throwable
     */
    public function save(array $options = []): void
    {
        try {
            DB::beginTransaction();

            parent::save($options);

            // synonymsから一旦全部削除して再登録する
            $this->synonyms()->delete();
            foreach (explode("\r\n", $this->synonymsStr) as $synonym) {
                $synonym = trim($synonym);
                if (empty($synonym)) {
                    continue;
                }

                $this->synonyms()->create([
                    'game_title_id' => $this->id,
                    'synonym' => synonym($synonym),
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

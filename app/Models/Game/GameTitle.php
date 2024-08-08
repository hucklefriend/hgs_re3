<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class GameTitle extends \Eloquent
{
    use KeyFindTrait;

    protected $guarded = ['id', 'synonymsStr'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
    ];

    /**
     * フランチャイズを取得
     *
     * @return BelongsTo
     */
    public function franchise(): BelongsTo
    {
        return $this->belongsTo(GameFranchise::class, 'game_franchise_id');
    }

    /**
     * シリーズを取得
     *
     * @return BelongsTo
     */
    public function series(): BelongsTo
    {
        return $this->belongsTo(GameSeries::class, 'game_series_id');
    }

    /**
     * @var string 俗称の改行区切り文字列
     */
    public string $synonymsStr = '';

    /**
     * 俗称
     *
     * @return HasMany
     */
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
     * パッケージグループを取得
     *
     * @return BelongsToMany
     */
    public function packageGroups(): BelongsToMany
    {
        return $this->belongsToMany(GamePackageGroup::class, GameTitlePackageGroupLink::class);
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
     * 関連商品を取得
     *
     * @return BelongsToMany
     */
    public function relatedProducts(): BelongsToMany
    {
        return $this->belongsToMany(GameRelatedProduct::class, GameTitleRelatedProductLink::class);
    }

    /**
     * 保存
     *
     * @throws \Throwable
     */
    public function save(array $options = []): void
    {
        if ($this->game_franchise_id !== null && $this->game_series_id !== null) {
            $this->game_series_id = null;
        }

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

    /**
     * 前のタイトルを取得
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
     * 次のタイトルを取得
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

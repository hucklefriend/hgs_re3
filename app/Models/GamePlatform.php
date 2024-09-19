<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class GamePlatform extends Model
{
    use KeyFindTrait;

    protected $guarded = ['id', 'synonymsStr'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'sort_order' => 0
    ];

    /**
     * メーカーを取得
     *
     * @return BelongsTo
     */
    public function maker(): BelongsTo
    {
        return $this->belongsTo(GameMaker::class, 'game_maker_id');
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
        return $this->hasMany(GamePlatformSynonym::class, 'game_platform_id');
    }

    /**
     * 俗称の読み取り
     *
     * @return void
     */
    public function loadSynonyms(): void
    {
        $this->synonymsStr = $this->synonyms()
            ->pluck('synonym')
            ->implode("\r\n");
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
                    'game_platform_id' => $this->id,
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
     * 削除
     *
     * @throws \Throwable
     */
    public function delete(): void
    {
        try {
            DB::beginTransaction();
            $this->synonyms()->delete();
            parent::delete();
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * 前のプラットフォームを取得
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
     * 次のプラットフォームを取得
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
     * 関連商品
     *
     * @return BelongsToMany
     */
    public function relatedProducts(): BelongsToMany
    {
        return $this->belongsToMany(GameRelatedProduct::class, GamePlatformRelatedProductLink::class);
    }
}

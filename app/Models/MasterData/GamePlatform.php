<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GamePlatform extends Model
{
    protected $guarded = ['id', 'synonymsStr'];

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

    public function synonyms(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(GameMakerSynonym::class, 'game_maker_id');
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
     * 保存
     *
     * @throws \Throwable
     */
    public function save(array $options = []): void
    {
        try {
            DB::beginTransaction();

            parent::save($options);

            // game_maker_synonymから一旦全部削除して再登録する
            $this->synonyms()->delete();

            foreach (explode("\r\n", $this->synonymsStr) as $synonym) {
                $synonym = trim($synonym);
                if (empty($synonym)) {
                    continue;
                }

                $this->synonyms()->create([
                    'game_platform_id' => $this->id,
                    'synonym'       => $synonym
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
}

<?php

namespace App\Models;

use App\Models\Extensions\KeyFindTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use App\Enums\Rating;
use App\Enums\GameMakerType;

class GameMaker extends Model
{
    use KeyFindTrait;
    use HasFactory;

    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array キャスト属性
     */
    protected $casts = [
        'type' => GameMakerType::class,
        'rating' => Rating::class,
    ];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'name'     => '',
        'phonetic' => '',
        'rating'   => Rating::None,
    ];

    /**
     * 関連メーカーを取得
     *
     * @return BelongsTo
     */
    public function relatedMaker(): BelongsTo
    {
        return $this->belongsTo(GameMaker::class, 'related_game_maker_id');
    }

    /**
     * 紐づけ元の関連メーカーを取得
     *
     * @return HasMany
     */
    public function relatedChildren(): HasMany
    {
        return $this->hasMany(GameMaker::class, 'related_game_maker_id');
    }

    /**
     * パッケージ
     *
     * @return BelongsToMany
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(GamePackage::class, GameMakerPackageLink::class);
    }

    public function setRating(): self
    {
        if ($this->packages->where('rating', '=', Rating::R18A->value)->count() > 0) {
            $this->rating = Rating::R18A;
        }

        return $this;
    }

    /**
     * 保存
     *
     * @throws \Throwable
     */
    public function save(array $options = []): void
    {
        $this->setRating();

        parent::save($options);
    }
}

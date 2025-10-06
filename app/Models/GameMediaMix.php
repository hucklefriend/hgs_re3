<?php

namespace App\Models;

use App\Enums\MediaMixType;
use App\Enums\Rating;
use App\Models\Extensions\KeyFindTrait;
use App\Models\Extensions\OgpTrait;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;

class GameMediaMix extends Model
{
    use KeyFindTrait;
    use OgpTrait;

    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];
    protected $casts = [
        'type'   => MediaMixType::class,
        'rating' => Rating::class,
    ];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'type'         => MediaMixType::MOVIE,
        'name'         => '',
        'node_name'    => '',
        'h1_node_name' => '',
        'rating'       => Rating::None,
        'sort_order'   => 1,
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
     * フランチャイズを取得
     * メディアミックスグループが設定されている場合はメディアミックスグループ側のフランチャイズを取得
     *
     * @return GameFranchise|null
     */
    public function getFranchise(): ?GameFranchise
    {
        if ($this->franchise) {
            return $this->franchise;
        } else if ($this->mediaMixGroup) {
            return $this->mediaMixGroup->franchise;
        }

        return null;
    }

    /**
     * メディアミックスグループを取得
     *
     * @return BelongsTo
     */
    public function mediaMixGroup(): BelongsTo
    {
        return $this->belongsTo(GameMediaMixGroup::class, 'game_media_mix_group_id');
    }

    /**
     * タイトル
     *
     * @return BelongsToMany
     */
    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class);
    }

    /**
     * 関連商品
     *
     * @return BelongsToMany
     */
    public function relatedProducts(): BelongsToMany
    {
        return $this->belongsToMany(GameRelatedProduct::class, GameMediaMixRelatedProductLink::class);
    }

    /**
     * 保存処理
     *
     * @param array $options
     * @return bool
     */
    public function save(array $options = []): bool
    {
        if ($this->game_franchise_id !== null && $this->game_media_mix_group_id != null) {
            $this->game_media_mix_group_id = null;
        }

        return parent::save($options);
    }
}

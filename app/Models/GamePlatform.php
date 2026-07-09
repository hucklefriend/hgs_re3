<?php

namespace App\Models;

use App\Models\Extensions\KeyFindTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GamePlatform extends Model
{
    const ID_STEAM = 45;

    const ID_PS3 = 12;
    const ID_PSP = 14;
    const ID_PSV = 28;
    const ID_PS4 = 33;
    const ID_PS5 = 44;

    const ID_XB1 = 35;
    const ID_XBXS = 43;

    const ID_3DS = 26;
    const ID_N3DS = 32;
    const ID_WIIU = 29;
    const ID_SWITCH = 34;

    const ID_GOG = 46;
    const ID_EGG = 47;
    const ID_EPIC = 50;

    const ID_DMM = 48;
    const ID_FANZA = 49;

    use KeyFindTrait;

    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array キャスト属性
     */
    protected $casts = [
        'id' => 'integer',
        'type' => \App\Enums\GamePlatformType::class,
    ];

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

    /**
     * Steamか
     *
     * @return bool
     */
    public function isSteam(): bool
    {
        return $this->id === self::ID_STEAM;
    }

    /**
     * PlayStationNetwork対応プラットフォームか
     *
     * @return bool
     */
    public function isSupportedOnPlayStationStore(): bool
    {
        return in_array($this->id, [self::ID_PS3, self::ID_PSP, self::ID_PSV, self::ID_PS4, self::ID_PS5]);
    }

    /**
     * XboxGameStore対応プラットフォームか
     *
     * @return bool
     */
    public function isSupportedOnXboxGameStore(): bool
    {
        return in_array($this->id, [self::ID_XB1, self::ID_XBXS]);
    }

    /**
     * My Nintendo Store対応プラットフォームか
     *
     * @return bool
     */
    public function isSupportedOnMyNintendoStore(): bool
    {
        return in_array($this->id, [self::ID_3DS, self::ID_N3DS, self::ID_WIIU, self::ID_SWITCH]);
    }

    /**
     * GOGか
     *
     * @return bool
     */
    public function isGog(): bool
    {
        return $this->id === self::ID_GOG;
    }

    /**
     * Eggか
     *
     * @return bool
     */
    public function isEgg(): bool
    {
        return $this->id === self::ID_EGG;
    }

    /**
     * DMM GAMESか
     *
     * @return bool
     */
    public function isDMMGames(): bool
    {
        return $this->id === self::ID_DMM;
    }

    /**
     * FANZA GAMESか
     *
     * @return bool
     */
    public function isFanzaGames(): bool
    {
        return $this->id === self::ID_FANZA;
    }

    /**
     * EpicGamesStoreか
     *
     * @return bool
     */
    public function isEpic(): bool
    {
        return $this->id === self::ID_EPIC;
    }
}

<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GamePlatformSynonym extends Model
{
    public $incrementing = false;
    protected $fillable = ['game_platform_id', 'synonym'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * メーカーを取得
     *
     * @return BelongsTo
     */
    public function maker(): BelongsTo
    {
        return $this->belongsTo(GamePlatform::class, 'game_platform_id');
    }
}

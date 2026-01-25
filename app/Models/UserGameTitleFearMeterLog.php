<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class UserGameTitleFearMeterLog extends Model
{
    protected $hidden = [];

    protected $fillable = [
        'user_id',
        'game_title_id',
        'old_fear_meter',
        'new_fear_meter',
    ];

    const UPDATED_AT = null;

    /**
     * ユーザー
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ゲームタイトル
     *
     * @return BelongsTo
     */
    public function gameTitle(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class, 'game_title_id');
    }
}

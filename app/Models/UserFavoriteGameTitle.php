<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class UserFavoriteGameTitle extends Model
{
    protected $primaryKey = ['user_id', 'game_title_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'game_title_id',
    ];

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


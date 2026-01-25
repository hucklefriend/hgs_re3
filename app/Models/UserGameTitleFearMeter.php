<?php

namespace App\Models;

use App\Enums\FearMeter;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class UserGameTitleFearMeter extends Model
{
    protected $primaryKey = ['user_id', 'game_title_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'game_title_id',
        'fear_meter',
    ];

    protected $casts = [
        'fear_meter' => FearMeter::class,
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

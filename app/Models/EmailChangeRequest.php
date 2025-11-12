<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailChangeRequest extends Model
{
    protected $fillable = [
        'user_id',
        'new_email',
        'token',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    /**
     * リクエストの有効期限切れを判定
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * 対象のユーザーリレーション
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}



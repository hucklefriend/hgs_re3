<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFollow extends Model
{
    protected $primaryKey = ['follower_id', 'following_id'];
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'follower_id',
        'following_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * フォローするユーザー
     */
    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    /**
     * フォローされるユーザー
     */
    public function following(): BelongsTo
    {
        return $this->belongsTo(User::class, 'following_id');
    }
}

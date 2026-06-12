<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBlock extends Model
{
    protected $primaryKey = ['blocker_id', 'blocked_id'];
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'blocker_id',
        'blocked_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * ブロックするユーザー
     */
    public function blocker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'blocker_id');
    }

    /**
     * ブロックされるユーザー
     */
    public function blocked(): BelongsTo
    {
        return $this->belongsTo(User::class, 'blocked_id');
    }
}

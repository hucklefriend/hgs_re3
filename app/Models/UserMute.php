<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMute extends Model
{
    protected $primaryKey = ['muter_id', 'muted_id'];
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'muter_id',
        'muted_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * ミュートするユーザー
     */
    public function muter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'muter_id');
    }

    /**
     * ミュートされるユーザー
     */
    public function muted(): BelongsTo
    {
        return $this->belongsTo(User::class, 'muted_id');
    }
}

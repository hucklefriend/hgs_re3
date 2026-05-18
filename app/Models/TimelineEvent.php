<?php

namespace App\Models;

use App\Enums\TimelineActorType;
use App\Enums\TimelineEventType;
use App\Enums\TimelineSubjectType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimelineEvent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'event_type',
        'actor_type',
        'actor_id',
        'subject_type',
        'subject_id',
        'recipient_user_id',
        'payload',
    ];

    protected $casts = [
        'event_type'   => TimelineEventType::class,
        'actor_type'   => TimelineActorType::class,
        'subject_type' => TimelineSubjectType::class,
        'payload'      => 'array',
        'created_at'   => 'datetime',
    ];

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }
}

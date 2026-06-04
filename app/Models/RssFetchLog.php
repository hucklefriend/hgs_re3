<?php

namespace App\Models;

use App\Enums\RssSource;
use Illuminate\Database\Eloquent\Model;

class RssFetchLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'rss_source',
        'status',
        'new_article_count',
        'error_message',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'rss_source'        => RssSource::class,
        'new_article_count' => 'integer',
        'started_at'        => 'datetime',
        'finished_at'       => 'datetime',
    ];

    public function sourceLabel(): string
    {
        if ($this->rss_source === null) {
            return '全ソース';
        }
        return $this->rss_source->label();
    }

    public function isRunning(): bool
    {
        return $this->status === 'running';
    }

    public function isSuccess(): bool
    {
        return $this->status === 'success';
    }

    public function isError(): bool
    {
        return $this->status === 'error';
    }

    public function elapsedSeconds(): ?int
    {
        if ($this->finished_at === null) {
            return null;
        }
        return (int) $this->started_at->diffInSeconds($this->finished_at);
    }
}

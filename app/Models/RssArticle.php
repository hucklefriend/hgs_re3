<?php

namespace App\Models;

use App\Enums\RssSource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RssArticle extends Model
{
    public $timestamps = false;

    protected $guarded = ['id'];

    protected $casts = [
        'rss_source'         => RssSource::class,
        'has_horror_keyword' => 'boolean',
        'published_at'       => 'datetime',
        'created_at'         => 'datetime',
    ];

    public function matchedTitles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class, 'rss_article_matched_titles', 'rss_article_id', 'game_title_id');
    }

    public function matchedFranchises(): BelongsToMany
    {
        return $this->belongsToMany(GameFranchise::class, 'rss_article_matched_franchises', 'rss_article_id', 'game_franchise_id');
    }

    /**
     * OgpCache は url_hash = OgpCache.hash で紐付け
     */
    public function ogpCache(): HasOne
    {
        return $this->hasOne(OgpCache::class, 'hash', 'url_hash');
    }

    public static function makeGuidHash(string $source, string $guid): string
    {
        return hash('sha256', $source . '|' . $guid);
    }
}

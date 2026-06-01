<?php

namespace App\Jobs;

use App\Models\OgpCache;
use App\Models\RssArticle;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class FetchRssArticleOgp implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly int $rssArticleId) {}

    public function handle(): void
    {
        $article = RssArticle::find($this->rssArticleId);

        if (!$article) {
            Log::warning("FetchRssArticleOgp: article not found", ['rss_article_id' => $this->rssArticleId]);
            return;
        }

        OgpCache::findOrNewByUrl($article->url)->fetch()->saveOrDelete();
    }
}

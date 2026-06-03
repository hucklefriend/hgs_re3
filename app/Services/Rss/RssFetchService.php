<?php

namespace App\Services\Rss;

use App\Enums\RssSource;
use App\Jobs\FetchRssArticleOgp;
use App\Models\RssArticle;
use App\Services\Timeline\TimelineEventService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RssFetchService
{
    public function __construct(
        private readonly RssMatcherService $matcher,
        private readonly TimelineEventService $timelineEventService,
    ) {}

    /**
     * 全ソースを取得・処理する
     */
    public function fetchAll(): void
    {
        $this->matcher->buildTerms();

        foreach (RssSource::cases() as $source) {
            $this->fetchSource($source);
        }
    }

    /**
     * 指定ソースのみ取得・処理する
     */
    public function fetchBySource(RssSource $source): void
    {
        $this->matcher->buildTerms();
        $this->fetchSource($source);
    }

    private function fetchSource(RssSource $source): void
    {
        try {
            $response = Http::timeout(30)->get($source->feedUrl());
        } catch (\Exception $e) {
            Log::warning("RssFetchService: HTTP取得失敗", [
                'source' => $source->value,
                'url'    => $source->feedUrl(),
                'error'  => $e->getMessage(),
            ]);
            return;
        }

        if ($response->failed()) {
            Log::warning("RssFetchService: HTTPエラー", [
                'source' => $source->value,
                'url'    => $source->feedUrl(),
                'status' => $response->status(),
            ]);
            return;
        }

        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($response->body());
        libxml_clear_errors();
        libxml_use_internal_errors(false);

        if ($xml === false) {
            Log::warning("RssFetchService: XMLパース失敗", ['source' => $source->value]);
            return;
        }

        foreach ($this->extractItems($xml) as $item) {
            $this->processItem($source, $item);
        }
    }

    /**
     * RSS 2.0 / Atom 1.0 / RDF(RSS 1.0) の各形式からアイテム一覧を抽出する
     *
     * @return array<int, array{title: string, url: string, guid: string, description: string, published_at: string|null}>
     */
    private function extractItems(\SimpleXMLElement $xml): array
    {
        $items = [];

        // Atom 1.0
        if ($xml->getName() === 'feed') {
            foreach ($xml->entry as $entry) {
                $url  = $this->atomLinkHref($entry);
                $guid = (string) ($entry->id ?? $url);
                $items[] = [
                    'title'        => (string) ($entry->title ?? ''),
                    'url'          => $url,
                    'guid'         => $guid,
                    'description'  => strip_tags((string) ($entry->summary ?? $entry->content ?? '')),
                    'published_at' => (string) ($entry->published ?? $entry->updated ?? null),
                ];
            }
            return $items;
        }

        // RSS 2.0 / RDF(RSS 1.0)
        $channel   = $xml->channel ?? $xml;
        $itemNodes = $channel->item ?? $xml->item ?? [];

        foreach ($itemNodes as $item) {
            $link = (string) ($item->link ?? '');
            $guid = (string) ($item->guid ?? $link);
            $items[] = [
                'title'        => (string) ($item->title ?? ''),
                'url'          => $link,
                'guid'         => $guid,
                'description'  => strip_tags((string) ($item->description ?? '')),
                'published_at' => (string) ($item->pubDate ?? null),
            ];
        }

        return $items;
    }

    /**
     * Atom の <link href="..."> から URL を取得する
     */
    private function atomLinkHref(\SimpleXMLElement $entry): string
    {
        foreach ($entry->link as $link) {
            $rel  = (string) ($link['rel'] ?? 'alternate');
            $href = (string) ($link['href'] ?? '');
            if ($rel === 'alternate' && $href !== '') {
                return $href;
            }
        }
        return (string) ($entry->link ?? '');
    }

    /**
     * 1アイテムを処理する
     *
     * @param array{title: string, url: string, guid: string, description: string, published_at: string|null} $item
     */
    private function processItem(RssSource $source, array $item): void
    {
        $url  = trim($item['url']);
        $guid = trim($item['guid']);

        if ($url === '' || $guid === '') {
            return;
        }

        $guidHash = RssArticle::makeGuidHash($source->value, $guid);

        if (RssArticle::where('rss_source', $source->value)->where('guid_hash', $guidHash)->exists()) {
            return;
        }

        $text   = $item['title'] . ' ' . $item['description'];
        $result = $this->matcher->match($text);

        if (!$result->hasAnyMatch()) {
            return;
        }

        $publishedAt = null;
        if (!empty($item['published_at'])) {
            try {
                $publishedAt = new \DateTime($item['published_at']);
            } catch (\Exception) {
                $publishedAt = null;
            }
        }

        DB::transaction(function () use ($source, $guid, $guidHash, $url, $result, $publishedAt) {
            $article = RssArticle::create([
                'rss_source'         => $source->value,
                'guid'               => $guid,
                'guid_hash'          => $guidHash,
                'url'                => $url,
                'url_hash'           => hash('sha256', $url),
                'has_horror_keyword' => $result->hasHorrorKeyword,
                'published_at'       => $publishedAt,
                'created_at'         => now(),
            ]);

            if (!empty($result->matchedFranchiseIds)) {
                $article->matchedFranchises()->attach($result->matchedFranchiseIds);
            }

            FetchRssArticleOgp::dispatch($article->id);

            $this->timelineEventService->recordRssArticleEvent($article->id);
        });
    }
}

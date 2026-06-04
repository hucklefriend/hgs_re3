<?php

namespace App\Services\Rss;

use App\Models\GameFranchise;
use App\Models\GameSeries;
use Illuminate\Support\Facades\Cache;

class RssMatcherService
{
    private const HORROR_KEYWORD = 'ホラー';
    private const MIN_TERM_LENGTH = 3;
    private const CACHE_TTL = 3600; // 1時間
    private const CACHE_KEY = 'rss_matcher_terms';

    /** @var array{id: int, term: string}[] */
    private array $franchiseTerms = [];

    private bool $built = false;

    /**
     * 全マッチング用語をビルドしてインスタンス変数に保持する。
     * ターム一覧は Laravel Cache に1時間キャッシュして毎回のDBアクセスを省く。
     */
    public function buildTerms(): void
    {
        if ($this->built) {
            return;
        }

        $cached = Cache::get(self::CACHE_KEY);

        if ($cached !== null) {
            $this->franchiseTerms = $cached['franchiseTerms'];
            $this->built = true;
            return;
        }

        $franchiseTerms = [];

        GameFranchise::select('id', 'name')->each(function (GameFranchise $franchise) use (&$franchiseTerms) {
            $name = trim($franchise->name);
            if ($name !== '' && mb_strlen($name) > self::MIN_TERM_LENGTH) {
                $franchiseTerms[] = ['id' => $franchise->id, 'term' => $name];
            }
        });

        // シリーズ名でマッチした場合も franchise_id で記録する
        GameSeries::select('id', 'name', 'game_franchise_id')->each(function (GameSeries $series) use (&$franchiseTerms) {
            $name = trim($series->name);
            if ($name !== '' && mb_strlen($name) > self::MIN_TERM_LENGTH) {
                $franchiseTerms[] = ['id' => $series->game_franchise_id, 'term' => $name];
            }
        });

        $this->franchiseTerms = $franchiseTerms;
        $this->built = true;

        Cache::put(self::CACHE_KEY, [
            'franchiseTerms' => $franchiseTerms,
        ], self::CACHE_TTL);
    }

    /**
     * テキストに対してマッチングを実行する。
     * buildTerms() を先に呼んでおく必要がある。
     */
    public function match(string $text): MatchResult
    {
        $matchedFranchiseIds = [];

        foreach ($this->franchiseTerms as ['id' => $id, 'term' => $term]) {
            if (str_contains($text, $term)) {
                $matchedFranchiseIds[$id] = true;
            }
        }

        $hasHorrorKeyword = empty($matchedFranchiseIds) && str_contains($text, self::HORROR_KEYWORD);

        return new MatchResult(
            matchedFranchiseIds: array_keys($matchedFranchiseIds),
            hasHorrorKeyword: $hasHorrorKeyword,
        );
    }

    /**
     * キャッシュをクリアする（テスト・デバッグ用）
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
        $this->built = false;
        $this->franchiseTerms = [];
    }
}

<?php

namespace App\Services\Timeline;

use App\Enums\FearMeter;
use App\Enums\TimelineActorType;
use App\Enums\TimelineEventType;
use App\Enums\TimelineSubjectType;
use App\Models\GameTitle;
use App\Models\Information;
use App\Models\OgpCache;
use App\Models\RssArticle;
use App\Models\TimelineEvent;
use App\Models\UserFavoriteGameTitle;
use App\Models\UserGameTitleReview;
use App\Models\UserTimelineSetting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class TimelineEventService
{
    public function recordUserRegisteredEvent(int $userId, \Illuminate\Support\Carbon $registeredAt): void
    {
        TimelineEvent::create([
            'event_type'   => TimelineEventType::UserRegistered,
            'actor_type'   => TimelineActorType::User,
            'actor_id'     => $userId,
            'subject_type' => TimelineSubjectType::User,
            'subject_id'   => $userId,
            'created_at'   => $registeredAt,
        ]);
    }

    public function recordReviewEvent(int $userId, int $reviewId, bool $isNew): void
    {
        $eventType = $isNew ? TimelineEventType::ReviewPosted : TimelineEventType::ReviewUpdated;

        if (!$isNew && $this->hasRecentEventForSubject($userId, TimelineSubjectType::Review, $reviewId)) {
            return;
        }

        TimelineEvent::create([
            'event_type'   => $eventType,
            'actor_type'   => TimelineActorType::User,
            'actor_id'     => $userId,
            'subject_type' => TimelineSubjectType::Review,
            'subject_id'   => $reviewId,
            'created_at'   => now(),
        ]);
    }

    public function recordFearMeterEvent(int $userId, int $gameTitleId, bool $isNew, int $fearMeterValue): void
    {
        $eventType = $isNew ? TimelineEventType::FearMeterPosted : TimelineEventType::FearMeterUpdated;

        if (!$isNew && $this->hasRecentEventForSubject($userId, TimelineSubjectType::GameTitle, $gameTitleId)) {
            return;
        }

        TimelineEvent::create([
            'event_type'   => $eventType,
            'actor_type'   => TimelineActorType::User,
            'actor_id'     => $userId,
            'subject_type' => TimelineSubjectType::GameTitle,
            'subject_id'   => $gameTitleId,
            'payload'      => ['fear_meter_label' => FearMeter::from($fearMeterValue)->text()],
            'created_at'   => now(),
        ]);
    }

    /**
     * ユーザー向けタイムラインイベントを取得する。
     * お気に入りタイトルの更新、自分への通知、お知らせ、設定で有効なRSS記事を対象とする。
     *
     * @return array<int, array<string, mixed>>
     */
    public function fetchForUser(int $userId, int $limit = 20): array
    {
        $events = $this->queryForUser($userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $reviewSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Review)
            ->pluck('subject_id');
        $gameTitleSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)
            ->pluck('subject_id');
        $informationSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Information)
            ->pluck('subject_id');
        $rssArticleSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::RssArticle)
            ->pluck('subject_id');

        $reviews = UserGameTitleReview::with('gameTitle')
            ->whereIn('id', $reviewSubjectIds)
            ->get()
            ->keyBy('id');
        $gameTitles = GameTitle::whereIn('id', $gameTitleSubjectIds)
            ->get()
            ->keyBy('id');
        $informations = Information::whereIn('id', $informationSubjectIds)
            ->get()
            ->keyBy('id');
        $rssArticles = RssArticle::with('ogpCache')
            ->whereIn('id', $rssArticleSubjectIds)
            ->get()
            ->keyBy('id');

        $this->fetchMissingOgp($rssArticles);

        return $events->map(fn ($e) => $this->toDisplayArray($e, $reviews, $gameTitles, $informations, $rssArticles))->all();
    }

    /**
     * @param Collection<int, UserGameTitleReview> $reviews
     * @param Collection<int, GameTitle> $gameTitles
     * @param Collection<int, Information> $informations
     * @param Collection<int, RssArticle> $rssArticles
     */
    private function toDisplayArray(TimelineEvent $event, Collection $reviews, Collection $gameTitles, Collection $informations, Collection $rssArticles = new Collection()): array
    {
        $actor = $event->actor;
        $actorName    = $actor?->withdrawn_at ? '（退会ユーザー）' : $actor?->name;
        $actorShowId  = $actor?->withdrawn_at ? null : $actor?->show_id;

        $base = [
            'type'             => $event->event_type->value,
            'actor_name'       => $actorName,
            'actor_show_id'    => $actorShowId,
            'fear_meter_label' => $event->payload['fear_meter_label'] ?? null,
            'note'             => $event->payload['note'] ?? null,
            'created_at'       => $event->created_at,
        ];

        if ($event->subject_type === TimelineSubjectType::RssArticle) {
            $article = $rssArticles[$event->subject_id] ?? null;
            $ogp     = $article?->ogpCache;
            return array_merge($base, [
                'game_title_name'   => null,
                'game_title_key'    => null,
                'review_key'        => null,
                'total_score'       => null,
                'has_spoiler'       => false,
                'information_id'    => null,
                'information_head'  => null,
                'rss_article_url'   => $article?->url,
                'rss_source_label'  => $article?->rss_source?->label(),
                'ogp_title'         => $ogp?->title,
                'ogp_image'         => $ogp?->image,
                'ogp_description'   => $ogp?->description,
                'rss_published_at'  => $article?->published_at,
            ]);
        }

        if ($event->subject_type === TimelineSubjectType::User) {
            return array_merge($base, [
                'game_title_name'  => null,
                'game_title_key'   => null,
                'review_key'       => null,
                'total_score'      => null,
                'has_spoiler'      => false,
                'information_id'   => null,
                'information_head' => null,
            ]);
        }

        if ($event->subject_type === TimelineSubjectType::Review) {
            $review    = $reviews[$event->subject_id] ?? null;
            $gameTitle = $review?->gameTitle;
            return array_merge($base, [
                'game_title_name'  => $gameTitle?->name,
                'game_title_key'   => $gameTitle?->key,
                'review_key'       => $review?->key,
                'total_score'      => $review?->total_score,
                'has_spoiler'      => $review?->has_spoiler ?? false,
                'information_id'   => null,
                'information_head' => null,
            ]);
        }

        if ($event->subject_type === TimelineSubjectType::Information) {
            $information = $informations[$event->subject_id] ?? null;
            return array_merge($base, [
                'game_title_name'  => null,
                'game_title_key'   => null,
                'review_key'       => null,
                'total_score'      => null,
                'has_spoiler'      => false,
                'information_id'   => $information?->id,
                'information_head' => $information?->head,
            ]);
        }

        $gameTitle = $gameTitles[$event->subject_id] ?? null;
        return array_merge($base, [
            'game_title_name'  => $gameTitle?->name,
            'game_title_key'   => $gameTitle?->key,
            'review_key'       => null,
            'total_score'      => null,
            'has_spoiler'      => false,
            'information_id'   => null,
            'information_head' => null,
        ]);
    }

    /**
     * フランチャイズ詳細ページ用タイムラインイベントを取得する。
     * 対象フランチャイズに紐づいた RSS 記事と、フランチャイズ内タイトルの更新を返す。
     *
     * @return array<int, array<string, mixed>>
     */
    public function fetchForFranchise(int $franchiseId, int $limit = 10): array
    {
        $franchiseTitleIds = GameTitle::where(function ($q) use ($franchiseId) {
            $q->where('game_franchise_id', $franchiseId)
              ->orWhereHas('series', fn ($q2) => $q2->where('game_franchise_id', $franchiseId));
        })->pluck('id');

        $events = TimelineEvent::with('actor')
            ->where(function ($q) use ($franchiseId, $franchiseTitleIds) {
                $q->where(function ($q2) use ($franchiseId) {
                    $q2->where('event_type', TimelineEventType::RssArticlePosted->value)
                       ->whereIn('subject_id', function ($sub) use ($franchiseId) {
                           $sub->select('rss_article_id')
                               ->from('rss_article_matched_franchises')
                               ->where('game_franchise_id', $franchiseId);
                       });
                });
                if ($franchiseTitleIds->isNotEmpty()) {
                    $q->orWhere(function ($q2) use ($franchiseTitleIds) {
                        $q2->where('event_type', TimelineEventType::GameTitleUpdated->value)
                           ->whereIn('subject_id', $franchiseTitleIds);
                    });
                }
            })
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $gameTitleSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)
            ->pluck('subject_id');
        $rssArticleSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::RssArticle)
            ->pluck('subject_id');

        $gameTitles  = GameTitle::whereIn('id', $gameTitleSubjectIds)->get()->keyBy('id');
        $rssArticles = RssArticle::with('ogpCache')
            ->whereIn('id', $rssArticleSubjectIds)
            ->get()
            ->keyBy('id');

        $this->fetchMissingOgp($rssArticles);

        return $events->map(fn ($e) => $this->toDisplayArray($e, collect(), $gameTitles, collect(), $rssArticles))->all();
    }

    public function fetchForRootPaginated(int $perPage = 20): LengthAwarePaginator
    {
        $paginator = TimelineEvent::with('actor')
            ->whereIn('event_type', [
                TimelineEventType::InformationPosted->value,
                TimelineEventType::GameTitleUpdated->value,
                TimelineEventType::RssArticlePosted->value,
            ])
            ->orderByDesc('created_at')
            ->paginate($perPage);

        $items = $paginator->getCollection();

        $gameTitleSubjectIds   = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)->pluck('subject_id');
        $informationSubjectIds = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Information)->pluck('subject_id');
        $rssArticleSubjectIds  = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::RssArticle)->pluck('subject_id');

        $gameTitles   = GameTitle::whereIn('id', $gameTitleSubjectIds)->get()->keyBy('id');
        $informations = Information::whereIn('id', $informationSubjectIds)->get()->keyBy('id');
        $rssArticles  = RssArticle::with('ogpCache')->whereIn('id', $rssArticleSubjectIds)->get()->keyBy('id');

        $this->fetchMissingOgp($rssArticles);

        return $paginator->setCollection(
            $items->map(fn ($e) => $this->toDisplayArray($e, collect(), $gameTitles, $informations, $rssArticles))
        );
    }

    public function fetchForFranchisePaginated(int $franchiseId, int $perPage = 20): LengthAwarePaginator
    {
        $franchiseTitleIds = GameTitle::where(function ($q) use ($franchiseId) {
            $q->where('game_franchise_id', $franchiseId)
              ->orWhereHas('series', fn ($q2) => $q2->where('game_franchise_id', $franchiseId));
        })->pluck('id');

        $paginator = TimelineEvent::with('actor')
            ->where(function ($q) use ($franchiseId, $franchiseTitleIds) {
                $q->where(function ($q2) use ($franchiseId) {
                    $q2->where('event_type', TimelineEventType::RssArticlePosted->value)
                       ->whereIn('subject_id', function ($sub) use ($franchiseId) {
                           $sub->select('rss_article_id')
                               ->from('rss_article_matched_franchises')
                               ->where('game_franchise_id', $franchiseId);
                       });
                });
                if ($franchiseTitleIds->isNotEmpty()) {
                    $q->orWhere(function ($q2) use ($franchiseTitleIds) {
                        $q2->where('event_type', TimelineEventType::GameTitleUpdated->value)
                           ->whereIn('subject_id', $franchiseTitleIds);
                    });
                }
            })
            ->orderByDesc('created_at')
            ->paginate($perPage);

        $items = $paginator->getCollection();

        $gameTitleSubjectIds  = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)->pluck('subject_id');
        $rssArticleSubjectIds = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::RssArticle)->pluck('subject_id');

        $gameTitles  = GameTitle::whereIn('id', $gameTitleSubjectIds)->get()->keyBy('id');
        $rssArticles = RssArticle::with('ogpCache')->whereIn('id', $rssArticleSubjectIds)->get()->keyBy('id');

        $this->fetchMissingOgp($rssArticles);

        return $paginator->setCollection(
            $items->map(fn ($e) => $this->toDisplayArray($e, collect(), $gameTitles, collect(), $rssArticles))
        );
    }

    public function fetchForUserPaginated(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        $paginator = $this->queryForUser($userId)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        $items = $paginator->getCollection();

        $reviewSubjectIds      = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Review)->pluck('subject_id');
        $gameTitleSubjectIds   = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)->pluck('subject_id');
        $informationSubjectIds = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Information)->pluck('subject_id');
        $rssArticleSubjectIds  = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::RssArticle)->pluck('subject_id');

        $reviews      = UserGameTitleReview::with('gameTitle')->whereIn('id', $reviewSubjectIds)->get()->keyBy('id');
        $gameTitles   = GameTitle::whereIn('id', $gameTitleSubjectIds)->get()->keyBy('id');
        $informations = Information::whereIn('id', $informationSubjectIds)->get()->keyBy('id');
        $rssArticles  = RssArticle::with('ogpCache')->whereIn('id', $rssArticleSubjectIds)->get()->keyBy('id');

        $this->fetchMissingOgp($rssArticles);

        return $paginator->setCollection(
            $items->map(fn ($e) => $this->toDisplayArray($e, $reviews, $gameTitles, $informations, $rssArticles))
        );
    }

    private function queryForUser(int $userId): Builder
    {
        $favoriteGameTitleIds = UserFavoriteGameTitle::where('user_id', $userId)
            ->pluck('game_title_id');

        $franchiseIds = collect();
        if ($favoriteGameTitleIds->isNotEmpty()) {
            $favoriteTitles = GameTitle::with('franchise', 'series.franchise')
                ->whereIn('id', $favoriteGameTitleIds)
                ->get();
            $franchiseIds = $favoriteTitles
                ->map(fn ($title) => $title->getFranchise()?->id)
                ->filter()
                ->unique()
                ->values();
        }

        $setting = UserTimelineSetting::forUser($userId);
        $showHorrorKeywordRss = $setting->show_horror_keyword_rss;
        $showFavoriteFranchiseRss = $setting->show_favorite_franchise_rss;
        $showAnyRss = $showHorrorKeywordRss
            || ($showFavoriteFranchiseRss && $franchiseIds->isNotEmpty());

        return TimelineEvent::with('actor')
            ->where(function ($query) use (
                $userId,
                $favoriteGameTitleIds,
                $franchiseIds,
                $showHorrorKeywordRss,
                $showFavoriteFranchiseRss,
                $showAnyRss,
            ) {
                $query->where(function ($favoriteTitleQuery) use ($favoriteGameTitleIds) {
                    $favoriteTitleQuery
                        ->where('event_type', TimelineEventType::GameTitleUpdated->value)
                        ->whereIn('subject_id', $favoriteGameTitleIds);
                })
                    ->orWhere('recipient_user_id', $userId)
                    ->orWhere('event_type', TimelineEventType::InformationPosted->value);

                if ($showAnyRss) {
                    $query->orWhere(function ($rssEventQuery) use (
                        $franchiseIds,
                        $showHorrorKeywordRss,
                        $showFavoriteFranchiseRss,
                    ) {
                        $rssEventQuery
                            ->where('event_type', TimelineEventType::RssArticlePosted->value)
                            ->where(function ($rssArticleQuery) use (
                                $franchiseIds,
                                $showHorrorKeywordRss,
                                $showFavoriteFranchiseRss,
                            ) {
                                if ($showHorrorKeywordRss) {
                                    $rssArticleQuery->whereIn('subject_id', function ($subquery) {
                                        $subquery->select('id')
                                            ->from('rss_articles')
                                            ->where('has_horror_keyword', true);
                                    });
                                }

                                if ($showFavoriteFranchiseRss && $franchiseIds->isNotEmpty()) {
                                    $matchedFranchiseArticleIds = function ($subquery) use ($franchiseIds) {
                                        $subquery->select('rss_article_id')
                                            ->from('rss_article_matched_franchises')
                                            ->whereIn('game_franchise_id', $franchiseIds->all());
                                    };

                                    if ($showHorrorKeywordRss) {
                                        $rssArticleQuery->orWhereIn('subject_id', $matchedFranchiseArticleIds);
                                    } else {
                                        $rssArticleQuery->whereIn('subject_id', $matchedFranchiseArticleIds);
                                    }
                                }
                            });
                    });
                }
            });
    }

    /**
     * ルートページ用タイムラインイベントを取得する。
     * お知らせ・ゲームタイトル更新・RSSゲーム情報（全件対象）を返す。
     *
     * @return array<int, array<string, mixed>>
     */
    public function fetchForRoot(int $limit = 5): array
    {
        $events = TimelineEvent::with('actor')
            ->whereIn('event_type', [
                TimelineEventType::InformationPosted->value,
                TimelineEventType::GameTitleUpdated->value,
                TimelineEventType::RssArticlePosted->value,
            ])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $gameTitleSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)
            ->pluck('subject_id');
        $informationSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Information)
            ->pluck('subject_id');
        $rssArticleSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::RssArticle)
            ->pluck('subject_id');

        $gameTitles   = GameTitle::whereIn('id', $gameTitleSubjectIds)->get()->keyBy('id');
        $informations = Information::whereIn('id', $informationSubjectIds)->get()->keyBy('id');
        $rssArticles  = RssArticle::with('ogpCache')
            ->whereIn('id', $rssArticleSubjectIds)
            ->get()
            ->keyBy('id');

        $this->fetchMissingOgp($rssArticles);

        return $events->map(fn ($e) => $this->toDisplayArray($e, collect(), $gameTitles, $informations, $rssArticles))->all();
    }

    /**
     * プロフィールページ用：指定ユーザーの行動タイムラインを取得する（レビュー・怖さメーターのみ）
     * @return array<int, array<string, mixed>>
     */
    public function fetchForProfileUser(int $userId, int $limit = 5): array
    {
        $events = TimelineEvent::with('actor')
            ->where('actor_type', TimelineActorType::User->value)
            ->where('actor_id', $userId)
            ->whereIn('event_type', [
                TimelineEventType::ReviewPosted->value,
                TimelineEventType::ReviewUpdated->value,
                TimelineEventType::FearMeterPosted->value,
                TimelineEventType::FearMeterUpdated->value,
                TimelineEventType::UserRegistered->value,
            ])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return $this->resolveProfileUserEvents($events);
    }

    public function fetchForProfileUserPaginated(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        $paginator = TimelineEvent::with('actor')
            ->where('actor_type', TimelineActorType::User->value)
            ->where('actor_id', $userId)
            ->whereIn('event_type', [
                TimelineEventType::ReviewPosted->value,
                TimelineEventType::ReviewUpdated->value,
                TimelineEventType::FearMeterPosted->value,
                TimelineEventType::FearMeterUpdated->value,
                TimelineEventType::UserRegistered->value,
            ])
            ->orderByDesc('created_at')
            ->paginate($perPage);

        $items = $paginator->getCollection();

        $reviewSubjectIds    = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Review)->pluck('subject_id');
        $gameTitleSubjectIds = $items->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)->pluck('subject_id');

        $reviews    = UserGameTitleReview::with('gameTitle')->whereIn('id', $reviewSubjectIds)->get()->keyBy('id');
        $gameTitles = GameTitle::whereIn('id', $gameTitleSubjectIds)->get()->keyBy('id');

        return $paginator->setCollection(
            $items->map(fn ($e) => $this->toDisplayArray($e, $reviews, $gameTitles, collect()))
        );
    }

    /** @param Collection<int, TimelineEvent> $events */
    private function resolveProfileUserEvents(Collection $events): array
    {
        $reviewSubjectIds    = $events->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Review)->pluck('subject_id');
        $gameTitleSubjectIds = $events->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)->pluck('subject_id');

        $reviews    = UserGameTitleReview::with('gameTitle')->whereIn('id', $reviewSubjectIds)->get()->keyBy('id');
        $gameTitles = GameTitle::whereIn('id', $gameTitleSubjectIds)->get()->keyBy('id');

        return $events->map(fn ($e) => $this->toDisplayArray($e, $reviews, $gameTitles, collect()))->all();
    }

    public function recordInformationEvent(int $informationId): void
    {
        TimelineEvent::create([
            'event_type'   => TimelineEventType::InformationPosted,
            'actor_type'   => TimelineActorType::System,
            'actor_id'     => null,
            'subject_type' => TimelineSubjectType::Information,
            'subject_id'   => $informationId,
            'created_at'   => now(),
        ]);
    }

    public function recordRssArticleEvent(int $rssArticleId): void
    {
        TimelineEvent::create([
            'event_type'   => TimelineEventType::RssArticlePosted,
            'actor_type'   => TimelineActorType::System,
            'actor_id'     => null,
            'subject_type' => TimelineSubjectType::RssArticle,
            'subject_id'   => $rssArticleId,
            'created_at'   => now(),
        ]);
    }

    public function recordGameTitleUpdatedEvent(int $gameTitleId, ?string $note = null): void
    {
        TimelineEvent::create([
            'event_type'   => TimelineEventType::GameTitleUpdated,
            'actor_type'   => TimelineActorType::System,
            'actor_id'     => null,
            'subject_type' => TimelineSubjectType::GameTitle,
            'subject_id'   => $gameTitleId,
            'payload'      => $note !== null ? ['note' => $note] : null,
            'created_at'   => now(),
        ]);
    }

    public function getLastGameTitleUpdatedAt(int $gameTitleId): ?Carbon
    {
        $event = TimelineEvent::where('event_type', TimelineEventType::GameTitleUpdated->value)
            ->where('subject_type', TimelineSubjectType::GameTitle->value)
            ->where('subject_id', $gameTitleId)
            ->orderByDesc('created_at')
            ->first();

        return $event?->created_at;
    }

    /** @param Collection<int, RssArticle> $rssArticles */
    private function fetchMissingOgp(Collection $rssArticles): void
    {
        foreach ($rssArticles as $article) {
            if ($article->ogpCache !== null) {
                continue;
            }
            try {
                OgpCache::findOrNewByUrl($article->url)->fetch()->saveOrDelete();
                $article->load('ogpCache');
            } catch (\Exception $e) {
                Log::warning('TimelineEventService: OGP on-demand fetch failed', [
                    'rss_article_id' => $article->id,
                    'error'          => $e->getMessage(),
                ]);
            }
        }
    }

    private function hasRecentEventForSubject(int $userId, TimelineSubjectType $subjectType, int $subjectId): bool
    {
        return TimelineEvent::where('actor_type', TimelineActorType::User->value)
            ->where('actor_id', $userId)
            ->where('subject_type', $subjectType->value)
            ->where('subject_id', $subjectId)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->exists();
    }

}

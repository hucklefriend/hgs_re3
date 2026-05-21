<?php

namespace App\Services\Timeline;

use App\Enums\FearMeter;
use App\Enums\TimelineActorType;
use App\Enums\TimelineEventType;
use App\Enums\TimelineSubjectType;
use App\Models\GameTitle;
use App\Models\TimelineEvent;
use App\Models\UserFavoriteGameTitle;
use App\Models\UserGameTitleReview;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class TimelineEventService
{
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
     * 現在は「お気に入りタイトルの更新」と「自分への通知」のみ対象。
     * フォロー機能実装後にフォロー中ユーザーの活動を追加する。
     *
     * @return array<int, array<string, mixed>>
     */
    public function fetchForUser(int $userId, int $limit = 20): array
    {
        $favoriteGameTitleIds = UserFavoriteGameTitle::where('user_id', $userId)
            ->pluck('game_title_id');

        $events = TimelineEvent::with('actor')
            ->where(function ($q) use ($userId, $favoriteGameTitleIds) {
                $q->where(function ($q2) use ($favoriteGameTitleIds) {
                    $q2->where('event_type', TimelineEventType::GameTitleUpdated->value)
                        ->whereIn('subject_id', $favoriteGameTitleIds);
                })
                ->orWhere('recipient_user_id', $userId);
            })
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $reviewSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::Review)
            ->pluck('subject_id');
        $gameTitleSubjectIds = $events
            ->filter(fn ($e) => $e->subject_type === TimelineSubjectType::GameTitle)
            ->pluck('subject_id');

        $reviews = UserGameTitleReview::with('gameTitle')
            ->whereIn('id', $reviewSubjectIds)
            ->get()
            ->keyBy('id');
        $gameTitles = GameTitle::whereIn('id', $gameTitleSubjectIds)
            ->get()
            ->keyBy('id');

        return $events->map(fn ($e) => $this->toDisplayArray($e, $reviews, $gameTitles))->all();
    }

    /** @param Collection<int, UserGameTitleReview> $reviews */
    /** @param Collection<int, GameTitle> $gameTitles */
    private function toDisplayArray(TimelineEvent $event, Collection $reviews, Collection $gameTitles): array
    {
        $actor = $event->actor;
        $actorName    = $actor?->withdrawn_at ? '（退会ユーザー）' : $actor?->name;
        $actorShowId  = $actor?->withdrawn_at ? null : $actor?->show_id;

        $base = [
            'type'             => $event->event_type->value,
            'actor_name'       => $actorName,
            'actor_show_id'    => $actorShowId,
            'fear_meter_label' => $event->payload['fear_meter_label'] ?? null,
            'created_at'       => $event->created_at,
        ];

        if ($event->subject_type === TimelineSubjectType::Review) {
            $review    = $reviews[$event->subject_id] ?? null;
            $gameTitle = $review?->gameTitle;
            return array_merge($base, [
                'game_title_name' => $gameTitle?->name,
                'game_title_key'  => $gameTitle?->key,
                'review_key'      => $review?->key,
                'total_score'     => $review?->total_score,
                'has_spoiler'     => $review?->has_spoiler ?? false,
            ]);
        }

        $gameTitle = $gameTitles[$event->subject_id] ?? null;
        return array_merge($base, [
            'game_title_name' => $gameTitle?->name,
            'game_title_key'  => $gameTitle?->key,
            'review_key'      => null,
            'total_score'     => null,
            'has_spoiler'     => false,
        ]);
    }

    public function recordGameTitleUpdatedEvent(int $gameTitleId): void
    {
        TimelineEvent::create([
            'event_type'   => TimelineEventType::GameTitleUpdated,
            'actor_type'   => TimelineActorType::System,
            'actor_id'     => null,
            'subject_type' => TimelineSubjectType::GameTitle,
            'subject_id'   => $gameTitleId,
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

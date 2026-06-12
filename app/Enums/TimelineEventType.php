<?php

namespace App\Enums;

enum TimelineEventType: string
{
    case ReviewPosted = 'review_posted';
    case ReviewUpdated = 'review_updated';
    case FearMeterPosted = 'fear_meter_posted';
    case FearMeterUpdated = 'fear_meter_updated';
    case GameTitleUpdated = 'game_title_updated';
    case ReviewLiked = 'review_liked';
    case InformationPosted = 'information_posted';
    case RssArticlePosted = 'rss_article_posted';
    case UserRegistered = 'user_registered';

    public function label(): string
    {
        return match ($this) {
            self::ReviewPosted => 'レビューを投稿しました',
            self::ReviewUpdated => 'レビューを更新しました',
            self::FearMeterPosted => '怖さメーターを投稿しました',
            self::FearMeterUpdated => '怖さメーターを更新しました',
            self::GameTitleUpdated => 'データが更新されました',
            self::ReviewLiked => 'レビューにいいねしてくれました',
            self::InformationPosted => 'お知らせが投稿されました',
            self::RssArticlePosted => 'ゲーム情報が公開されました',
            self::UserRegistered => 'HGN に登録しました',
        };
    }
}

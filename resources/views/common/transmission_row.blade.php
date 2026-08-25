@php
    $eventLabel = match ($event['type']) {
        'review_posted' => 'REVIEW POSTED',
        'review_updated' => 'REVIEW UPDATED',
        'fear_meter_posted' => 'FEAR METER',
        'fear_meter_updated' => 'FEAR METER UPDATED',
        'game_title_updated' => 'LINEUP UPDATED',
        'review_liked' => 'REVIEW SIGNAL',
        'information_posted' => 'INFORMATION',
        'rss_article_posted' => 'EXTERNAL NEWS',
        'user_registered' => 'NEW USER',
        default => 'NETWORK EVENT',
    };
    $eventTitle = match ($event['type']) {
        'review_posted', 'review_updated' => ($event['actor_name'] ?? 'ユーザー') . 'さんが「' . ($event['game_title_name'] ?? 'タイトル') . '」のレビューを更新',
        'fear_meter_posted', 'fear_meter_updated' => '「' . ($event['game_title_name'] ?? 'タイトル') . '」に怖さ評価が届きました',
        'game_title_updated' => '「' . ($event['game_title_name'] ?? 'タイトル') . '」のデータを更新',
        'review_liked' => '「' . ($event['game_title_name'] ?? 'タイトル') . '」のレビューに反応がありました',
        'information_posted' => $event['information_head'] ?? 'お知らせを更新しました',
        'rss_article_posted' => $event['ogp_title'] ?? (($event['rss_source_label'] ?? '外部メディア') . 'の新着記事'),
        'user_registered' => ($event['actor_name'] ?? '新しいユーザー') . 'さんがHGNに接続',
        default => '新しい通信を受信しました',
    };
    $eventUrl = null;
    if (!empty($event['rss_article_url'])) {
        $eventUrl = $event['rss_article_url'];
    } elseif (in_array($event['type'], ['review_posted', 'review_updated', 'review_liked'], true) && !empty($event['game_title_key']) && !empty($event['review_key'])) {
        $eventUrl = route('Game.TitleReview', ['titleKey' => $event['game_title_key'], 'reviewKey' => $event['review_key']]);
    } elseif (!empty($event['game_title_key'])) {
        $eventUrl = route('Game.TitleDetail', ['titleKey' => $event['game_title_key']]);
    } elseif ($event['type'] === 'information_posted' && !empty($event['information_id'])) {
        $eventUrl = route('InformationDetail', ['info' => $event['information_id']]);
    }
@endphp

<article class="home-transmission-row">
    <span class="home-transmission-row__index">{{ str_pad((string) $index, 2, '0', STR_PAD_LEFT) }}</span>
    <p class="site-signal-type">{{ $eventLabel }}@if (!empty($event['rss_source_label'])) / {{ strtoupper($event['rss_source_label']) }}@endif</p>
    <div @class([
        'home-transmission-row__body',
        'home-transmission-row__body--with-image' => !empty($event['ogp_image']),
    ])>
        <div class="home-transmission-row__content">
            <h3>@if ($eventUrl)<a href="{{ $eventUrl }}" @if ($event['type'] === 'rss_article_posted') target="_blank" rel="noopener" @endif>{{ $eventTitle }}</a>@else{{ $eventTitle }}@endif</h3>
            @if (!empty($event['note']))<p class="home-transmission-row__note">{{ $event['note'] }}</p>@endif
        </div>
        @if (!empty($event['ogp_image']))
            <img class="home-transmission-row__image" src="{{ $event['ogp_image'] }}" alt="" width="220" loading="lazy" decoding="async">
        @endif
    </div>
    <time datetime="{{ $event['created_at']->toIso8601String() }}">{{ $event['created_at']->format('Y.m.d H:i') }}</time>
    <span class="home-transmission-row__arrow" aria-hidden="true">{{ $event['type'] === 'rss_article_posted' ? '↗' : '→' }}</span>
</article>

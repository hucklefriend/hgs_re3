@extends('layout')

@section('title', 'ルート')
@section('body-class', 'site-page site-page--home')
@section('current-node-title', 'ホラーゲームネットワーク(β)')

@section('site-content')
    <section class="home-hero" aria-labelledby="home-hero-title">
        <div class="site-frame home-hero__grid" data-grid-frame>
            <div class="home-title-copy" data-page-reveal>
                <h1 id="home-hero-title"><span>HORROR</span><span>GAME</span><strong>NETWORK</strong></h1>
                <p class="home-title-copy__lead">ホラーゲームを探す。記録する。語り合う。<br>すべての作品へ接続するためのコミュニティ・ネットワーク。</p>
            </div>
            <nav class="home-command-menu" aria-label="メインメニュー" data-page-reveal>
                <p class="home-command-menu__label">NODE DIRECTORY</p>
                <a class="home-command-link home-command-link--primary" href="{{ route('Game.Lineup') }}"><span class="home-command-link__no">01</span><span><b>ゲームを探す</b><small>SEARCH LINEUP</small></span></a>
                <a class="home-command-link" href="{{ route('Game.Platform') }}"><span class="home-command-link__no">02</span><span><b>シリーズ・機種から見る</b><small>BROWSE LINEUP</small></span></a>
                <a class="home-command-link" href="#latest"><span class="home-command-link__no">03</span><span><b>新着タイムライン</b><small>LATEST TRANSMISSIONS</small></span><span class="home-command-link__arrow" aria-hidden="true">↓</span></a>
                <a class="home-command-link" href="{{ route('Game.Reviews') }}"><span class="home-command-link__no">04</span><span><b>レビュー</b><small>USER REPORTS</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('Informations') }}"><span class="home-command-link__no">05</span><span><b>お知らせ</b><small>INFORMATION</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('About') }}"><span class="home-command-link__no">06</span><span><b>このサイトについて</b><small>ABOUT HGN</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('PrivacyPolicy') }}"><span class="home-command-link__no">07</span><span><b>プライバシーポリシー</b><small>PRIVACY POLICY</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('Contact') }}"><span class="home-command-link__no">08</span><span><b>問い合わせ</b><small>CONTACT</small></span></a>
            </nav>
        </div>
    </section>

    <section class="home-latest" id="latest" aria-labelledby="home-latest-title">
        <div class="site-frame">
            <header class="site-section-heading" data-page-reveal>
                <div><h2 id="home-latest-title">LATEST<br><span>TRANSMISSIONS</span></h2></div>
            </header>
            <div class="home-transmission-list" data-page-reveal>
                @forelse ($timelineEvents as $event)
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
                        <span class="home-transmission-row__index">{{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>
                        <div>
                            <p class="site-signal-type">{{ $eventLabel }}@if (!empty($event['rss_source_label'])) / {{ strtoupper($event['rss_source_label']) }}@endif</p>
                            <h3>@if ($eventUrl)<a href="{{ $eventUrl }}" @if ($event['type'] === 'rss_article_posted') target="_blank" rel="noopener" @endif>{{ $eventTitle }}</a>@else{{ $eventTitle }}@endif</h3>
                            @if (!empty($event['note']))<p class="home-transmission-row__note">{{ $event['note'] }}</p>@endif
                            <time datetime="{{ $event['created_at']->toIso8601String() }}">{{ $event['created_at']->format('Y.m.d / H:i') }}</time>
                        </div>
                        <span class="home-transmission-row__arrow" aria-hidden="true">{{ $event['type'] === 'rss_article_posted' ? '↗' : '→' }}</span>
                    </article>
                @empty
                    <p class="site-empty-state">現在受信している新着情報はありません。</p>
                @endforelse
                <a class="home-all-signals" href="{{ route('Timeline') }}">すべての通信を見る <span>ALL SIGNALS →</span></a>
            </div>
        </div>
    </section>
@endsection

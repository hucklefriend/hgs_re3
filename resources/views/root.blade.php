@extends('layout')

@section('title', 'ルート')
@section('body-class', 'site-page site-page--home')
@section('current-node-title', 'ホラーゲームネットワーク(β)')

@section('site-content')
    <section class="home-hero" aria-labelledby="home-hero-title">
        <div class="site-frame home-hero__grid" data-grid-frame>
            <div class="site-grid-axis" aria-hidden="true">
                <span>NETWORK GRID / ROOT</span>
                <span>X:<b data-grid-columns>16</b> / Y:AUTO</span>
            </div>
            <div class="home-title-copy" data-page-reveal>
                <p class="site-eyebrow"><span>JP / HORROR ARCHIVE</span><span>EST. 2024</span></p>
                <p class="home-title-copy__code" aria-hidden="true">HGN / ROOT / 001</p>
                <h1 id="home-hero-title"><span>HORROR GAME</span><strong>NETWORK</strong></h1>
                <p class="home-title-copy__lead">ホラーゲームを探す。記録する。語り合う。<br>すべての作品へ接続するためのコミュニティ・データベース。</p>
            </div>
            <nav class="home-command-menu" aria-label="メインメニュー" data-page-reveal>
                <p class="home-command-menu__label">SELECT CHANNEL</p>
                <a class="home-command-link home-command-link--primary" href="{{ route('Game.Lineup') }}"><span class="home-command-link__no">01</span><span><b>ゲームを探す</b><small>SEARCH DATABASE</small></span><span class="home-command-link__arrow" aria-hidden="true">→</span></a>
                <a class="home-command-link" href="{{ route('Game.Platform') }}"><span class="home-command-link__no">02</span><span><b>シリーズ・機種から見る</b><small>BROWSE LINEUP</small></span><span class="home-command-link__arrow" aria-hidden="true">→</span></a>
                <a class="home-command-link" href="#latest"><span class="home-command-link__no">03</span><span><b>新着タイムライン</b><small>LATEST TRANSMISSIONS</small></span><span class="home-command-link__arrow" aria-hidden="true">↓</span></a>
                <a class="home-command-link" href="{{ route('Game.Reviews') }}"><span class="home-command-link__no">04</span><span><b>レビュー</b><small>USER REPORTS</small></span><span class="home-command-link__arrow" aria-hidden="true">→</span></a>
            </nav>
            <a class="home-scroll-cue" href="#latest"><span>SCROLL TO LATEST</span><i aria-hidden="true"></i></a>
        </div>
    </section>

    <section class="home-latest" id="latest" aria-labelledby="home-latest-title">
        <div class="site-frame">
            <header class="site-section-heading" data-page-reveal>
                <div><p class="site-eyebrow">INCOMING DATA / {{ now()->format('m.d') }}</p><h2 id="home-latest-title">LATEST<br><span>TRANSMISSIONS</span></h2></div>
                <div class="site-section-heading__meta"><span><b>{{ count($timelineEvents) }}</b> NEW SIGNALS</span><span>SERVER RENDERED <b>LIVE</b></span></div>
            </header>
            <div class="home-transmission-grid">
                <div class="home-transmission-list" data-page-reveal>
                    @forelse ($timelineEvents as $event)
                        @php
                            $eventLabel = match ($event['type']) {
                                'review_posted' => 'REVIEW POSTED',
                                'review_updated' => 'REVIEW UPDATED',
                                'fear_meter_posted' => 'FEAR METER',
                                'fear_meter_updated' => 'FEAR METER UPDATED',
                                'game_title_updated' => 'DATABASE UPDATED',
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
                <aside class="home-network-links" aria-label="サイトメニュー" data-page-reveal>
                    <p class="home-network-links__label">NETWORK NODES</p>
                    <a href="{{ route('Informations') }}"><span>01</span><b>お知らせ</b><small>{{ $infoList->count() }} ACTIVE</small></a>
                    @guest
                        <a href="{{ route('Account.Login') }}"><span>02</span><b>ログイン</b><small>CONNECT ACCOUNT</small></a>
                        <a href="{{ route('Account.Register') }}"><span>03</span><b>新規登録</b><small>CREATE NODE</small></a>
                    @else
                        <a href="{{ route('User.MyNode.Top') }}"><span>02</span><b>マイノード</b><small>PERSONAL NETWORK</small></a>
                        <a href="{{ route('Account.Logout') }}"><span>03</span><b>ログアウト</b><small>DISCONNECT</small></a>
                    @endguest
                    <a href="{{ route('About') }}"><span>04</span><b>このサイトについて</b><small>ABOUT HGN</small></a>
                    <a href="{{ route('Contact') }}"><span>05</span><b>問い合わせ</b><small>CONTACT</small></a>
                </aside>
            </div>
        </div>
    </section>
@endsection

@extends('layout')

@section('title', 'ルート')
@section('body-class', 'site-page site-page--home')
@section('current-node-title', 'ホラーゲームネットワーク(β)')

@section('site-content')
    <section class="home-hero" aria-labelledby="home-hero-title">
        <div class="site-frame home-hero__grid" data-grid-frame>
            <div class="home-title-copy">
                <h1 id="home-hero-title"><span>HORROR</span><span>GAME</span><strong>NETWORK</strong></h1>
                <p class="home-title-copy__lead">ホラーゲームを探す。記録する。語り合う。<br>すべての作品へ接続するためのコミュニティ・ネットワーク。</p>
            </div>
            <nav class="home-command-menu" aria-label="メインメニュー">
                <p class="home-command-menu__label">NODE DIRECTORY</p>
                <a class="home-command-link" href="{{ route('Game.Lineup') }}"><span class="home-command-link__no">01</span><span><b>ゲームを探す</b><small>SEARCH LINEUP</small></span></a>
                <a class="home-command-link" href="{{ route('Game.Platform') }}"><span class="home-command-link__no">02</span><span><b>シリーズ・機種から見る</b><small>BROWSE LINEUP</small></span></a>
                <a class="home-command-link" href="#latest"><span class="home-command-link__no">03</span><span><b>新着タイムライン</b><small>LATEST TRANSMISSIONS</small></span><span class="home-command-link__arrow" aria-hidden="true">↓</span></a>
                <a class="home-command-link" href="{{ route('Game.Reviews') }}"><span class="home-command-link__no">04</span><span><b>レビュー</b><small>USER REPORTS</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('Informations') }}"><span class="home-command-link__no">05</span><span><b>お知らせ</b><small>INFORMATION</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('About') }}"><span class="home-command-link__no">06</span><span><b>このサイトについて</b><small>ABOUT</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('PrivacyPolicy') }}"><span class="home-command-link__no">07</span><span><b>プライバシーポリシー</b><small>PRIVACY POLICY</small></span></a>
                <a class="home-command-link home-command-link--secondary" href="{{ route('Contact') }}"><span class="home-command-link__no">08</span><span><b>問い合わせ</b><small>CONTACT</small></span></a>
            </nav>
        </div>
    </section>

    <section class="home-latest" id="latest" aria-labelledby="home-latest-title">
        <div class="site-frame">
            <header class="site-section-heading">
                <div><h2 id="home-latest-title">LATEST<br><span>TRANSMISSIONS</span></h2></div>
            </header>
            <div class="home-transmission-list">
                @forelse ($timelineEvents as $event)
                    @include('common.transmission_row', ['event' => $event, 'index' => $loop->iteration])
                @empty
                    <p class="site-empty-state">現在受信している新着情報はありません。</p>
                @endforelse
                <div class="home-all-signals">
                    <a href="{{ route('Timeline') }}">すべての通信を見る</a>
                </div>
            </div>
        </div>
    </section>
@endsection

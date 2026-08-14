@extends('layout')

@php
    $titleDescription = '';
    if ($title->use_ogp_description == 1 && $title->ogp !== null && !empty($title->ogp->description)) {
        $titleDescription = $title->ogp->description;
    } elseif (!empty($title->description)) {
        $titleDescription = trim(strip_tags($title->description));
    }
    $releaseDigits = str_pad((string) $title->first_release_int, 8, '0', STR_PAD_LEFT);
    $releaseLabel = 'UNKNOWN';
    if ((int) $title->first_release_int > 0 && (int) $title->first_release_int < 99999999) {
        $releaseLabel = substr($releaseDigits, 0, 4) . '.' . substr($releaseDigits, 4, 2) . '.' . substr($releaseDigits, 6, 2);
    }
    $packageGroups = $title->packageGroups->sortByDesc('sort_order');
    $allPackages = $packageGroups->flatMap(fn ($group) => $group->packages);
    $platformLabels = $allPackages->map(fn ($package) => $package->platform?->acronym ?? $package->platform?->name)->filter()->unique()->values();
    $fearMeterMax = 4;
    $fearMeterAverage = $fearMeter ? max(0, min($fearMeterMax, (float) $fearMeter->average_rating)) : null;
    $fearMeterPercent = $fearMeterAverage !== null ? ($fearMeterAverage / $fearMeterMax) * 100 : 0;
@endphp

@section('title', $title->name)
@section('body-class', 'site-page site-page--title-detail')
@section('current-node-title', $title->name)
@section('ratingCheck', $title->rating == \App\Enums\Rating::None ? 'false' : 'true')

@section('ogp')
    @include('common.ogp_meta', [
        'ogpTitle' => $title->name,
        'ogpDescription' => $titleDescription,
        'ogpImage' => $title->ogp?->image ?? '/img/ogp.png',
        'ogpUrl' => route('Game.TitleDetail', ['titleKey' => $title->key]),
        'ogpType' => 'article',
    ])
@endsection

@section('site-content')
    <section class="title-hero" aria-labelledby="title-detail-name">
        <div class="site-frame title-hero__frame" data-grid-frame>
            <div class="site-grid-axis" aria-hidden="true"><span>NETWORK GRID / GT-{{ str_pad((string) $title->id, 5, '0', STR_PAD_LEFT) }}</span><span>X:<b data-grid-columns>16</b> / Y:AUTO</span></div>
            <nav class="title-breadcrumb" aria-label="パンくず">
                <a href="{{ route('Root') }}">HGN</a><span>/</span><a href="{{ route('Game.Lineup') }}">DATABASE</a><span>/</span><b>GT-{{ str_pad((string) $title->id, 5, '0', STR_PAD_LEFT) }}</b>
            </nav>

            @if (session('success'))<div class="title-alert title-alert--success" role="status">{!! nl2br(e(session('success'))) !!}</div>@endif
            @if (session('warning'))<div class="title-alert title-alert--warning" role="alert">{!! nl2br(e(session('warning'))) !!}</div>@endif
            @if (!$isOver18 && $title->rating == \App\Enums\Rating::R18Z)
                <p class="title-alert title-alert--warning">CERO-Z相当の年齢指定があるパッケージが含まれます。18歳未満には適さない表現が表示される場合があります。</p>
            @endif

            <div class="title-hero__layout">
                <div class="title-keyart" data-page-reveal>
                    <span class="title-keyart__stamp">KEY VISUAL / DATABASE</span>
                    @if ($title->ogp !== null && !empty($title->ogp->image))
                        <img src="{{ $title->ogp->image }}" width="{{ $title->ogp->image_width }}" height="{{ $title->ogp->image_height }}" alt="{{ $title->name }}">
                    @else
                        <div class="title-keyart__placeholder" aria-hidden="true"><span>HGN</span><strong>{{ mb_substr($title->name, 0, 1) }}</strong><small>NO VISUAL DATA</small></div>
                    @endif
                </div>

                <div class="title-summary" data-page-reveal>
                    <p class="site-eyebrow">DATABASE ENTRY / GT-{{ str_pad((string) $title->id, 5, '0', STR_PAD_LEFT) }}</p>
                    <h1 id="title-detail-name">{{ $title->name }}</h1>
                    @if ($title->series)<p class="title-summary__series">{{ $title->series->name }} / {{ $franchise?->name }}</p>@elseif ($franchise)<p class="title-summary__series">{{ $franchise->name }} FRANCHISE</p>@endif
                    @if ($titleDescription !== '')<p class="title-summary__description">{{ $titleDescription }}</p>@else<p class="title-summary__description title-summary__description--empty">作品説明はまだ登録されていません。</p>@endif
                    <dl class="title-facts">
                        <div><dt>RELEASE</dt><dd>{{ $releaseLabel }}</dd></div>
                        <div><dt>PLATFORM</dt><dd>{{ $platformLabels->isNotEmpty() ? $platformLabels->take(2)->implode(' / ') : 'UNKNOWN' }}</dd></div>
                        <div><dt>STATUS</dt><dd><span aria-hidden="true"></span> VERIFIED</dd></div>
                    </dl>
                    @auth
                        <form action="{{ route('api.user.favorite.toggle') }}" method="POST" class="favorite-toggle-form title-watch-form" data-component-use="1">
                            @csrf
                            <input type="hidden" name="game_title_id" value="{{ $title->id }}">
                            <button type="submit" class="title-watch-button{{ $isFavorite ? ' is-favorite' : '' }}" title="{{ $isFavorite ? 'お気に入りを解除' : 'お気に入りに登録' }}" aria-label="{{ $isFavorite ? 'お気に入りを解除' : 'お気に入りに登録' }}">{{ $isFavorite ? '★' : '☆' }}</button>
                            <span><b>お気に入り</b><small>ADD TO FAVORITES</small></span>
                        </form>
                    @else
                        <a class="title-login-action" href="{{ route('Account.Login') }}">ログインしてお気に入りに追加 <span>CONNECT →</span></a>
                    @endauth
                </div>
            </div>
        </div>
    </section>

    <section class="title-detail-body">
        <div class="site-frame title-detail-layout">
            <nav class="title-detail-menu" aria-label="ページ内メニュー" data-section-spy>
                <p>SELECT DATA</p>
                <a class="is-active" href="#overview"><span>01</span><b>作品情報</b><small>OVERVIEW</small></a>
                <a href="#fear-meter"><span>02</span><b>怖さメーター</b><small>FEAR METER</small></a>
                <a href="#reviews"><span>03</span><b>レビュー</b><small>USER REPORTS</small></a>
                <a href="#packages"><span>04</span><b>購入・エディション</b><small>PACKAGES</small></a>
            </nav>

            <div class="title-detail-content">
                <section class="title-data-section" id="overview" data-page-reveal>
                    <header><span>01</span><div><p>OVERVIEW</p><h2>作品情報</h2></div></header>
                    <div class="title-overview-grid">
                        <dl>
                            <div><dt>FRANCHISE</dt><dd>@if ($franchise)<a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}">{{ $franchise->name }}</a>@else—@endif</dd></div>
                            <div><dt>SERIES</dt><dd>{{ $title->series?->name ?? '—' }}</dd></div>
                            <div><dt>PLATFORMS</dt><dd>{{ $platformLabels->isNotEmpty() ? $platformLabels->implode(' / ') : '—' }}</dd></div>
                        </dl>
                        <p>{{ $titleDescription !== '' ? $titleDescription : '作品情報は現在編集中です。' }}</p>
                    </div>
                </section>

                <section class="title-data-section" id="fear-meter" data-page-reveal>
                    <header><span>02</span><div><p>FEAR METER</p><h2>怖さメーター</h2></div></header>
                    @if ($fearMeter)
                        <div class="title-fear-panel title-fear-meter">
                            <div><strong>{{ number_format($fearMeterAverage, 2) }}</strong><span>/ {{ number_format($fearMeterMax, 2) }}</span><small>{{ $fearMeter->fear_meter->text() }}</small></div>
                            <div class="title-fear-scale" aria-label="怖さ {{ number_format($fearMeterAverage, 2) }} / 4"><i style="width: {{ $fearMeterPercent }}%"></i></div>
                            <a href="{{ route('Game.TitleFearMeterComments', ['titleKey' => $title->key]) }}">コメントを見る →</a>
                            @auth<a href="{{ route('User.FearMeter.Form', ['titleKey' => $title->key, 'from' => 'title-detail']) }}">あなたの怖さメーター →</a>@endauth
                        </div>
                    @else
                        <div class="site-empty-state">怖さメーターはまだ入力されていません。@auth<a href="{{ route('User.FearMeter.Form', ['titleKey' => $title->key, 'from' => 'title-detail']) }}">最初の評価を送る →</a>@endauth</div>
                    @endif
                </section>

                <section class="title-data-section" id="reviews" data-page-reveal>
                    <header><span>03</span><div><p>USER REPORTS</p><h2>レビュー</h2></div></header>
                    @if ($reviewStatistic)
                        <div class="title-review-summary">
                            <strong>{{ $reviewStatistic->avg_total_score !== null ? round((float) $reviewStatistic->avg_total_score) : '—' }}</strong><span>/ 100</span><small>{{ $reviewStatistic->review_count }} REPORTS</small>
                        </div>
                    @endif
                    <div class="title-review-list">
                        @forelse ($recentReviews as $review)
                            <article>
                                <header><span>{{ $review->user?->name ?? 'HGN USER' }}</span><b>{{ $review->total_score !== null ? $review->total_score . ' / 100' : 'NO SCORE' }}</b></header>
                                @if ($review->has_spoiler)
                                    <p class="title-review-spoiler">このレビューにはネタバレが含まれます。詳細ページで表示できます。</p>
                                @else
                                    <p>{{ \Illuminate\Support\Str::limit($review->body, 240) }}</p>
                                @endif
                                <a href="{{ route('Game.TitleReview', ['titleKey' => $title->key, 'reviewKey' => $review->key]) }}">レビュー詳細 →</a>
                            </article>
                        @empty
                            <p class="site-empty-state">レビューはまだないようです。</p>
                        @endforelse
                    </div>
                    <div class="title-section-actions">
                        @if ($reviewStatistic)<a href="{{ route('Game.TitleReviews', ['titleKey' => $title->key]) }}">すべてのレビューを見る <span>{{ $reviewStatistic->review_count }} REPORTS →</span></a>@endif
                        @auth<a href="{{ route('User.Review.Form', ['titleKey' => $title->key]) }}">{{ $userReview ? 'レビューを編集する' : 'レビューを書く' }} <span>WRITE REPORT →</span></a>@endauth
                    </div>
                </section>

                <section class="title-data-section" id="packages" data-page-reveal>
                    <header><span>04</span><div><p>PACKAGES</p><h2>購入・エディション</h2></div></header>
                    <div class="title-package-list">
                        @forelse ($packageGroups as $packageGroup)
                            <article>
                                <div><p>PACKAGE GROUP / {{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}</p><h3>{{ $packageGroup->name }}</h3>@if (!empty($packageGroup->description))<div class="title-package-description">{!! nl2br($packageGroup->description) !!}</div>@endif</div>
                                <ul>
                                    @foreach ($packageGroup->packages->sortByDesc('sort_order') as $package)
                                        <li><a href="{{ route('Game.PlatformDetail', ['platformKey' => $package->platform->key]) }}">{{ $package->platform->acronym ?? $package->platform->name }}</a>@if (!empty($package->node_name)) / {!! $package->node_name !!}@endif <small>{{ $package->release_at }}</small></li>
                                    @endforeach
                                </ul>
                                <div class="title-package-shops">
                                    @foreach ($packageGroup->packages as $package)
                                        @foreach ($package->shops as $shop)
                                            <a href="{{ $shop->url }}" target="_blank" rel="noopener sponsored">{{ $shop->shop()?->name() ?? 'STORE' }} ↗</a>
                                        @endforeach
                                    @endforeach
                                </div>
                            </article>
                        @empty
                            <p class="site-empty-state">パッケージ情報はまだ登録されていません。</p>
                        @endforelse
                    </div>
                </section>

                @if ($title->series && $title->series->titles->count() > 1)
                    <section class="title-data-section title-related" data-page-reveal>
                        <header><span>05</span><div><p>RELATED ENTRIES</p><h2>シリーズ作品</h2></div></header>
                        <div>
                            @foreach ($title->series->titles->sortBy('first_release_int') as $sameSeriesTitle)
                                @continue($sameSeriesTitle->id === $title->id)
                                <a href="{{ route('Game.TitleDetail', ['titleKey' => $sameSeriesTitle->key]) }}"><b>{{ $sameSeriesTitle->name }}</b><span>OPEN ENTRY →</span></a>
                            @endforeach
                        </div>
                    </section>
                @endif
            </div>
        </div>
    </section>
@endsection

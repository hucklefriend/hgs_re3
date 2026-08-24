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
            <nav class="title-breadcrumb" aria-label="パンくず">
                <a href="{{ route('Root') }}">ROOT</a><span>/</span>
                <a href="{{ route('Game.Lineup') }}">LINEUP</a><span>/</span>
                @if ($franchise)
                    <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}">{{ $franchise->name }}</a><span>/</span>
                @endif
                <b>{{ $title->name }}</b>
            </nav>

            @if (session('success'))<div class="title-alert title-alert--success" role="status">{!! nl2br(e(session('success'))) !!}</div>@endif
            @if (session('warning'))<div class="title-alert title-alert--warning" role="alert">{!! nl2br(e(session('warning'))) !!}</div>@endif
            @if (!$isOver18 && $title->rating == \App\Enums\Rating::R18Z)
                <p class="title-alert title-alert--warning">CERO-Z相当の年齢指定があるパッケージが含まれます。18歳未満には適さない表現が表示される場合があります。</p>
            @endif

            <article class="title-hero__panel">
                <header class="site-standard-page__header title-hero__header node-head">
                    <h1 class="node-head-text" id="title-detail-name">{{ $title->name }}</h1>
                </header>

                <div class="title-hero__content">
                    <div class="title-keyart">
                        @if ($title->ogp !== null && !empty($title->ogp->image))
                            <img src="{{ $title->ogp->image }}" width="{{ $title->ogp->image_width }}" height="{{ $title->ogp->image_height }}" alt="{{ $title->name }}">
                        @else
                            <div class="title-keyart__placeholder" aria-hidden="true"><span>HGN</span><strong>{{ mb_substr($title->name, 0, 1) }}</strong><small>NO VISUAL DATA</small></div>
                        @endif
                    </div>

                    <div class="title-summary">
                        @if ($titleDescription !== '')<p class="title-summary__description">{{ $titleDescription }}</p>@else<p class="title-summary__description title-summary__description--empty">作品説明はまだ登録されていません。</p>@endif
                        <dl class="title-facts">
                            <div><dt>FIRST RELEASE</dt><dd>{{ $releaseLabel }}</dd></div>
                            <div><dt>SERIES</dt><dd>{{ $title->series?->name ?? '—' }}</dd></div>
                            <div><dt>PLATFORM</dt><dd>{{ $platformLabels->isNotEmpty() ? $platformLabels->implode(' / ') : 'UNKNOWN' }}</dd></div>
                        </dl>
                        @auth
                            <form action="{{ route('api.user.favorite.toggle') }}" method="POST" class="favorite-toggle-form title-watch-form" data-component-use="1">
                                @csrf
                                <input type="hidden" name="game_title_id" value="{{ $title->id }}">
                                <button type="submit" class="title-watch-button{{ $isFavorite ? ' is-favorite' : '' }}" title="{{ $isFavorite ? 'お気に入りを解除' : 'お気に入りに登録' }}" aria-label="{{ $isFavorite ? 'お気に入りを解除' : 'お気に入りに登録' }}">{{ $isFavorite ? '★' : '☆' }}</button>
                                <span><b>お気に入り</b><small>ADD TO FAVORITES</small></span>
                            </form>
                        @else
                            <a class="title-login-action" href="{{ route('Account.Login') }}">ログインしてお気に入りに追加</a>
                        @endauth
                    </div>
                </div>
            </article>
        </div>
    </section>

    <section class="title-detail-body">
        <div class="site-frame title-detail-layout">
            <nav class="title-detail-menu" aria-label="ページ内メニュー" data-section-spy>
                <p>SELECT DATA</p>
                <a class="is-active" href="#fear-meter"><span>01</span><b>怖さメーター</b><small>FEAR METER</small></a>
                <a href="#reviews"><span>02</span><b>レビュー</b><small>USER REPORTS</small></a>
                <a href="#packages"><span>03</span><b>購入・エディション</b><small>PACKAGES</small></a>
                @if ($title->series && $title->series->titles->count() > 1)
                    <a href="#related"><span>04</span><b>シリーズ</b><small>RELATED ENTRIES</small></a>
                @endif
            </nav>

            <div class="title-detail-content">
                <section class="title-data-section" id="fear-meter">
                    <header><span>01</span><div><p>FEAR METER</p><h2>怖さメーター</h2></div></header>
                    @if ($fearMeter)
                        <div class="title-fear-panel title-fear-meter" style="--fear-meter-position: {{ $fearMeterPercent }}%;">
                            <div class="title-fear-gauge" aria-hidden="true">
                                <div class="title-fear-gauge__rail">
                                    <i class="title-fear-gauge__fill"></i>
                                    <span class="title-fear-gauge__marker"><b>{{ number_format($fearMeterAverage, 1) }}</b></span>
                                </div>
                                <ol class="title-fear-gauge__ticks">
                                    @for ($fearStep = 0; $fearStep <= $fearMeterMax; $fearStep++)
                                        <li>{{ $fearStep }}</li>
                                    @endfor
                                </ol>
                            </div>

                            <ol class="title-fear-spectrum" aria-label="怖さ {{ number_format($fearMeterAverage, 1) }} / {{ number_format($fearMeterMax, 1) }}、{{ $fearMeter->fear_meter->text() }}">
                                @foreach (array_reverse(\App\Enums\FearMeter::cases()) as $fearLevel)
                                    @php
                                        $isCurrentFearLevel = $fearLevel->value === $fearMeter->fear_meter->value;
                                    @endphp
                                    <li @class(['is-current' => $isCurrentFearLevel])>
                                        <span>{{ $fearLevel->value }}</span>
                                        <b>{{ $fearLevel->text() }}</b>
                                    </li>
                                @endforeach
                            </ol>

                            <div class="title-fear-actions">
                                <a href="{{ route('Game.TitleFearMeterComments', ['titleKey' => $title->key]) }}">怖さコメントを見る</a>
                                @auth<a href="{{ route('User.FearMeter.Form', ['titleKey' => $title->key, 'from' => 'title-detail']) }}">あなたの怖さメーター →</a>@endauth
                            </div>
                        </div>
                    @else
                        <div class="site-empty-state">怖さメーターはまだ入力されていません。@auth<a href="{{ route('User.FearMeter.Form', ['titleKey' => $title->key, 'from' => 'title-detail']) }}">最初の評価を送る →</a>@endauth</div>
                    @endif
                </section>

                <section class="title-data-section" id="reviews">
                    <header><span>02</span><div><p>USER REPORTS</p><h2>レビュー</h2></div></header>
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
                                <a href="{{ route('Game.TitleReview', ['titleKey' => $title->key, 'reviewKey' => $review->key]) }}">レビュー詳細</a>
                            </article>
                        @empty
                            <p class="site-empty-state">レビューはまだないようです。</p>
                        @endforelse
                    </div>
                    <div class="title-section-actions">
                        @if ($reviewStatistic)<a href="{{ route('Game.TitleReviews', ['titleKey' => $title->key]) }}">すべてのレビューを見る</a>@endif
                        @auth<a href="{{ route('User.Review.Form', ['titleKey' => $title->key]) }}">{{ $userReview ? 'レビューを編集する' : 'レビューを書く' }} <span>WRITE REPORT →</span></a>@endauth
                    </div>
                </section>

                <section class="title-data-section" id="packages">
                    <header><span>03</span><div><p>PACKAGES</p><h2>購入・エディション</h2></div></header>
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
                    <section class="title-data-section title-related" id="related">
                        <header><span>04</span><div><p>RELATED ENTRIES</p><h2>シリーズ作品</h2></div></header>
                        <div>
                            @foreach ($title->series->titles->sortBy('first_release_int') as $sameSeriesTitle)
                                @continue($sameSeriesTitle->id === $title->id)
                                <a href="{{ route('Game.TitleDetail', ['titleKey' => $sameSeriesTitle->key]) }}"><b>{{ $sameSeriesTitle->name }}</b></a>
                            @endforeach
                        </div>
                    </section>
                @endif
            </div>
        </div>
    </section>
@endsection

@extends('layout')

@php
    $hasAdvancedFilters = ($platformId ?? null) !== null
        || ($makerId ?? null) !== null
        || ($fearMeterMin ?? null) !== null
        || ($fearMeterMax ?? null) !== null
        || ($releaseFrom ?? null) !== null
        || ($releaseTo ?? null) !== null;
@endphp

@section('title', 'ホラーゲームラインナップ')
@section('body-class', 'site-page site-page--lineup')
@section('current-node-title', 'ラインナップ')

@section('site-content')
    <section class="lineup-console" aria-labelledby="lineup-title">
        <div class="site-frame lineup-console__frame" data-grid-frame>
            <div class="site-grid-axis" aria-hidden="true">
                <span>NETWORK GRID / DATABASE</span>
                <span>X:<b data-grid-columns>16</b> / Y:AUTO</span>
            </div>
            <x-site.breadcrumb page-kind="database" page-title="GAME DATABASE" />

            <header class="lineup-console__title" data-page-reveal>
                <div>
                    <p class="site-eyebrow">ARCHIVE NODE / DB-01</p>
                    <h1 id="lineup-title">GAME<br><span>DATABASE</span></h1>
                </div>
                <p>登録されているホラーゲームを、タイトル・プラットフォーム・メーカー・怖さ・発売年から検索します。</p>
                <dl>
                    <div><dt>RESULTS</dt><dd>{{ number_format($total ?? 0) }}</dd></div>
                    <div><dt>PLATFORMS</dt><dd>{{ number_format(($platforms ?? collect())->count()) }}</dd></div>
                    <div><dt>MODE</dt><dd>{{ (!empty($text) || $hasAdvancedFilters) ? 'FILTERED' : 'LATEST' }}</dd></div>
                </dl>
            </header>

            <div class="lineup-console__layout" data-page-reveal>
                <nav class="lineup-console-menu" aria-label="検索メニュー">
                    <p>SELECT SEARCH MODE</p>
                    <button class="lineup-console-option {{ $hasAdvancedFilters ? '' : 'is-active' }}" type="button" data-console-control="title" aria-pressed="{{ $hasAdvancedFilters ? 'false' : 'true' }}">
                        <span>01</span><span><b>タイトルから検索</b><small>SEARCH BY TITLE</small></span><i aria-hidden="true">→</i>
                    </button>
                    <button class="lineup-console-option {{ $hasAdvancedFilters ? 'is-active' : '' }}" id="advanced-search-toggle" type="button" data-console-control="advanced" aria-pressed="{{ $hasAdvancedFilters ? 'true' : 'false' }}">
                        <span>02</span><span><b>条件を組み合わせる</b><small>ADVANCED FILTERS / <em id="advanced-search-label">開く</em></small></span><i id="advanced-search-icon" aria-hidden="true">▽</i>
                    </button>
                    <a class="lineup-console-option" href="#lineup-results">
                        <span>03</span><span><b>検索結果を見る</b><small>BROWSE RESULTS</small></span><i aria-hidden="true">↓</i>
                    </a>
                    <a class="lineup-console-option" href="{{ route('Game.Platform') }}">
                        <span>04</span><span><b>機種から探す</b><small>PLATFORM CHANNEL</small></span><i aria-hidden="true">→</i>
                    </a>
                </nav>

                <section class="lineup-console-display" aria-label="検索条件">
                    <form id="lineup-search-form" method="GET" action="{{ route('Game.Lineup') }}">
                        <div class="lineup-console-panel {{ $hasAdvancedFilters ? '' : 'is-active' }}" data-console-panel="title" @if ($hasAdvancedFilters) hidden @endif>
                            <header><span>MODE 01</span><b>TITLE SEARCH</b></header>
                            <div class="lineup-title-search">
                                <label for="search-input">ゲームタイトル</label>
                                <div>
                                    <input type="search" id="search-input" name="text" value="{{ $text ?? '' }}" placeholder="タイトル名を入力" autocomplete="off">
                                    <button type="submit">SEARCH <span aria-hidden="true">→</span></button>
                                </div>
                            </div>
                        </div>

                        <div
                            id="advanced-search-wrapper"
                            class="advanced-search-wrapper lineup-console-panel {{ $hasAdvancedFilters ? 'open' : '' }}"
                            data-console-panel="advanced"
                            @if (!$hasAdvancedFilters) hidden @endif
                        >
                            <header><span>MODE 02</span><b>ADVANCED FILTERS</b></header>
                            <div class="advanced-search-wrapper__inner lineup-filter-grid">
                                <label>
                                    <span>PLATFORM</span>
                                    <select id="lineup-platform-id" name="platform_id">
                                        <option value="0">すべて</option>
                                        @foreach ($platforms ?? [] as $platform)
                                            <option value="{{ $platform->id }}" @selected(($platformId ?? null) == $platform->id)>{{ $platform->name }}{{ $platform->acronym ? '（' . $platform->acronym . '）' : '' }}</option>
                                        @endforeach
                                    </select>
                                </label>
                                <label class="lineup-filter-grid__maker">
                                    <span>MAKER</span>
                                    <span class="lineup-maker-input">
                                        <input type="text" id="maker-name-input" name="maker_name" value="{{ $makerName ?? '' }}" placeholder="入力して選択" autocomplete="off">
                                        <button type="button" id="maker-clear-btn" style="{{ empty($makerName ?? '') ? 'display:none;' : '' }}" aria-label="メーカーをクリア">×</button>
                                        <span id="maker-suggestions" class="maker-suggest-list"></span>
                                    </span>
                                    <input type="hidden" id="maker-id-input" name="maker_id" value="{{ $makerId ?? '' }}">
                                </label>
                                <fieldset>
                                    <legend>FEAR METER</legend>
                                    <div>
                                        <select name="fear_meter_min" id="fear-meter-min" aria-label="怖さ下限">
                                            <option value="">下限なし</option>
                                            @for ($i = 0; $i <= 4; $i++)<option value="{{ $i }}" @selected(($fearMeterMin ?? null) !== null && $fearMeterMin == $i)>{{ $i }}</option>@endfor
                                        </select>
                                        <span>—</span>
                                        <select name="fear_meter_max" id="fear-meter-max" aria-label="怖さ上限">
                                            <option value="">上限なし</option>
                                            @for ($i = 0; $i <= 4; $i++)<option value="{{ $i }}" @selected(($fearMeterMax ?? null) !== null && $fearMeterMax == $i)>{{ $i }}</option>@endfor
                                        </select>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>RELEASE YEAR</legend>
                                    <div>
                                        <input type="number" name="release_from" value="{{ $releaseFrom ?? '' }}" placeholder="開始年" min="1980" max="{{ date('Y') }}" aria-label="発売年の開始">
                                        <span>—</span>
                                        <input type="number" name="release_to" value="{{ $releaseTo ?? '' }}" placeholder="終了年" min="1980" max="{{ date('Y') }}" aria-label="発売年の終了">
                                    </div>
                                </fieldset>
                            </div>
                            <footer>
                                <button type="button" id="search-reset-btn">RESET</button>
                                <button type="submit">APPLY FILTERS <span aria-hidden="true">→</span></button>
                            </footer>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    </section>

    <section class="lineup-results" id="lineup-results" aria-labelledby="lineup-results-title">
        <div class="site-frame">
            <header class="site-section-heading" data-page-reveal>
                <div><p class="site-eyebrow">DATABASE OUTPUT / {{ number_format($total ?? 0) }}</p><h2 id="lineup-results-title">SEARCH<br><span>RESULTS</span></h2></div>
                <p class="lineup-results__query">
                    @if (!empty($text))
                        TITLE: {{ $text }}
                    @elseif ($hasAdvancedFilters)
                        ADVANCED FILTERS ACTIVE
                    @else
                        LAST UPDATED ORDER
                    @endif
                </p>
            </header>

            <div class="lineup-result-list" data-page-reveal>
                @forelse ($franchises ?? [] as $franchise)
                    <section class="lineup-franchise" id="franchise-{{ $franchise->key }}-link-node">
                        <header>
                            <span>{{ str_pad((string) $loop->iteration, 2, '0', STR_PAD_LEFT) }}</span>
                            <div><p>FRANCHISE NODE</p><h3><a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}">{{ $franchise->name }}</a></h3></div>
                            <small>{{ count($franchise->searchSeries ?? []) + count($franchise->searchTitles ?? []) }} CHANNELS</small>
                        </header>
                        <div class="lineup-franchise__entries">
                            @foreach ($franchise->searchSeries ?? [] as $series)
                                <section class="lineup-series">
                                    <h4>{{ $series->name }} <small>SERIES</small></h4>
                                    @foreach ($series->searchTitles ?? [] as $gameTitle)
                                        <a href="{{ route('Game.TitleDetail', ['titleKey' => $gameTitle->key]) }}"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $gameTitle->name }}</b><small>OPEN ENTRY →</small></a>
                                    @endforeach
                                </section>
                            @endforeach
                            @foreach ($franchise->searchTitles ?? [] as $gameTitle)
                                <a href="{{ route('Game.TitleDetail', ['titleKey' => $gameTitle->key]) }}"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $gameTitle->name }}</b><small>OPEN ENTRY →</small></a>
                            @endforeach
                        </div>
                    </section>
                @empty
                    <p class="site-empty-state">この検索条件では、何も見つからないようです。</p>
                @endforelse
            </div>
            @isset($pager)<div class="lineup-results__pager">@include('common.pager', ['pager' => $pager])</div>@endisset
        </div>
    </section>
@endsection

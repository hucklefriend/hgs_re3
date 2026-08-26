@extends('layout')

@php
    $hasAdvancedFilters = ($platformId ?? null) !== null
        || ($fearMeterMin ?? null) !== null
        || ($fearMeterMax ?? null) !== null
        || ($releaseFrom ?? null) !== null
        || ($releaseTo ?? null) !== null;
    $hasActiveSearch = !empty($text) || $hasAdvancedFilters;
@endphp

@section('title', 'ラインナップ')
@section('body-class', 'site-page site-page--lineup')
@section('current-node-title', 'ラインナップ')

@section('nodes')
    <section class="lineup-console" aria-label="Game search">
        <div class="lineup-console__frame">
            <button class="lineup-search-toggle" id="lineup-search-toggle" type="button" aria-controls="lineup-search-panel" aria-expanded="{{ $hasActiveSearch ? 'true' : 'false' }}">タイトルを検索 <span aria-hidden="true">+</span></button>
            <section class="lineup-console-display @if ($hasActiveSearch) is-open @endif" id="lineup-search-panel" aria-label="Search controls" @if (!$hasActiveSearch) hidden @endif>
                <div class="lineup-search-panel__body">
                    <form id="lineup-search-form" method="GET" action="{{ route('Game.Lineup') }}">
                        <div class="lineup-console-panel">
                            <div class="lineup-title-search">
                                <label for="search-input">ゲームタイトル</label>
                                <div>
                                    <input type="search" id="search-input" name="text" value="{{ $text ?? '' }}" autocomplete="off">

                                </div>
                            </div>
                        </div>
                        <div class="lineup-console-panel">
                            <div class="advanced-search-wrapper__inner lineup-filter-grid">
                                <label>
                                    <span>プラットフォーム</span>
                                    <select id="lineup-platform-id" name="platform_id">
                                        <option value="0">すべて</option>
                                        @foreach ($platforms ?? [] as $platform)
                                            <option value="{{ $platform->id }}" @selected(($platformId ?? null) == $platform->id)>{{ $platform->name }}{{ $platform->acronym ? '（' . $platform->acronym . '）' : '' }}</option>
                                        @endforeach
                                    </select>
                                </label>
                                <fieldset>
                                    <legend>怖さメーター</legend>
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
                                    <legend>発売年</legend>
                                    <div>
                                        <input type="number" name="release_from" value="{{ $releaseFrom ?? '' }}" min="1980" max="{{ date('Y') }}" aria-label="発売年の開始">
                                        <span>—</span>
                                        <input type="number" name="release_to" value="{{ $releaseTo ?? '' }}" min="1980" max="{{ date('Y') }}" aria-label="発売年の終了">
                                    </div>
                                </fieldset>
                            </div>
                            <footer>
                                <button type="button" id="search-reset-btn">RESET</button>
                                <button type="submit" class="lineup-search-apply">APPLY FILTERS <span aria-hidden="true">→</span></button>
                            </footer>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    </section>

    <section class="lineup-results" id="lineup-results" aria-label="Search results">
        <div class="lineup-results__frame">

            <div class="lineup-result-list">
                @forelse ($franchises ?? [] as $franchise)
                    <section class="lineup-franchise" id="franchise-{{ $franchise->key }}-link-node">
                        <header>
                            <div><p>FRANCHISE NODE</p><h3><a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}">{{ $franchise->name }}<small>フランチャイズ</small></a></h3></div>
                        </header>
                        <div class="lineup-franchise__entries">
                            @foreach ($franchise->searchSeries ?? [] as $series)
                                <x-site.lineup-series :series="$series" :titles="$series->searchTitles ?? []" />
                            @endforeach
                            @if (count($franchise->searchSeries ?? []) > 0 && count($franchise->searchTitles ?? []) > 0)
                                <section class="lineup-series">
                                    <h4>単体タイトル</h4>
                            @endif
                            @foreach ($franchise->searchTitles ?? [] as $gameTitle)
                                <a href="{{ route('Game.TitleDetail', ['titleKey' => $gameTitle->key]) }}"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $gameTitle->name }}</b></a>
                            @endforeach
                            @if (count($franchise->searchSeries ?? []) > 0 && count($franchise->searchTitles ?? []) > 0)
                                </section>
                            @endif
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

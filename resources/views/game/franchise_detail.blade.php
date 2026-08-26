@extends('layout')

@php
    $breadcrumbItems = [
        ['label' => 'ラインナップ', 'url' => route('Game.Lineup')],
    ];
@endphp

@section('title', $franchise->name . 'フランチャイズ')
@section('current-node-title', $franchise->name . 'フランチャイズ')

@section('current-node-content')
    {!! nl2br($franchise->description) !!}
@endsection

@if (is_admin_user())
    @section('site-footer-action')
        <a href="{{ route('Admin.Game.Franchise.Detail', $franchise) }}" class="site-footer-action__link">管理へ</a>
    @endsection
@endif

@section('nodes')
    @if (!empty($timelineEvents))
    <section class="lineup-franchise franchise-detail-node" id="franchise-timeline-tree-node">
        <header>
            <div><p>TRANSMISSION NODE</p><h2>新着情報</h2></div>
        </header>
        <div class="home-transmission-list">
            @foreach ($timelineEvents as $event)
                @include('common.transmission_row', ['event' => $event, 'index' => $loop->iteration])
            @endforeach
            <div class="home-all-signals">
                <a href="{{ route('Game.FranchiseTimeline', ['franchiseKey' => $franchise->key]) }}">新着情報をもっと見る</a>
            </div>
        </div>
    </section>
    @endif

    <section class="lineup-franchise franchise-detail-node" id="title-lineup-tree-node">
        <header>
            <div><p>LINEUP NODE</p><h2>タイトルラインナップ</h2></div>
        </header>
        <div class="lineup-franchise__entries">
            @foreach ($franchise->series->sortBy('first_release_int') as $series)
                <x-site.lineup-series :series="$series" :titles="$series->titles->sortBy('first_release_int')" :id="$series->key . '-tree-node'" />
            @endforeach

            @if ($franchise->titles->count() > 0)
                @if ($franchise->series->count() > 0)
                    <section class="lineup-series">
                        <h4>単体タイトル</h4>
                @endif
                @foreach ($franchise->titles->sortBy('first_release_int') as $title)
                    <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" id="{{ $title->key }}-link-node"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $title->name }}</b></a>
                @endforeach
                @if ($franchise->series->count() > 0)
                    </section>
                @endif
            @endif
        </div>
    </section>


    @if ($franchise->mediaMixGroups->isNotEmpty() || $franchise->mediaMixes->isNotEmpty())

    <section class="lineup-franchise franchise-detail-node" id="media-mix-tree-node">
        <header>
            <div><p>MEDIA MIX NODE</p><h2>メディアミックス</h2></div>
        </header>
        <div class="lineup-franchise__entries">
            @foreach ($franchise->mediaMixGroups->sortBy('sort_order') as $mediaMixGroup)
                <section class="lineup-series" id="media-mix-group-{{ $mediaMixGroup->id }}-node">
                    <h4>{{ $mediaMixGroup->name }}</h4>
                    @foreach ($mediaMixGroup->mediaMixes->sortBy('sort_order') as $mediaMix)
                        <a href="{{ route('Game.MediaMixDetail', ['mediaMixKey' => $mediaMix->key]) }}" id="{{ $mediaMix->key }}-link-node"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $mediaMix->name }}</b></a>
                    @endforeach
                </section>
            @endforeach

            @if ($franchise->mediaMixes->isNotEmpty())
                @if ($franchise->mediaMixGroups->isNotEmpty())
                    <section class="lineup-series">
                        <h4>単体作品</h4>
                @endif
                @foreach ($franchise->mediaMixes as $mediaMix)
                    <a href="{{ route('Game.MediaMixDetail', ['mediaMixKey' => $mediaMix->key]) }}" id="{{ $mediaMix->key }}-link-node"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $mediaMix->name }}</b></a>
                @endforeach
                @if ($franchise->mediaMixGroups->isNotEmpty())
                    </section>
                @endif
            @endif
        </div>
    </section>

    @endif

@endsection

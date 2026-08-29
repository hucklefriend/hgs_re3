@extends('layout')

@php
    $breadcrumbItems = [
        ['label' => 'ラインナップ', 'url' => route('Game.Lineup')],
        [
            'label' => $franchise->name . 'フランチャイズ',
            'url' => route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]),
        ],
    ];
@endphp

@section('title', $franchise->name . ' 新着情報')
@section('current-node-title', $franchise->name . ' 新着情報')

@section('nodes')
    <section class="lineup-franchise franchise-detail-node" id="franchise-timeline-list-node">
        <header>
            <x-site.timeline-heading title="新着情報一覧" />
        </header>
        <div class="home-transmission-list">
            @forelse ($events as $event)
                @include('common.transmission_row', ['event' => $event, 'index' => $loop->iteration])
            @empty
                <p class="site-empty-state">新しい通信は、まだ届いていないようだ。</p>
            @endforelse
            @if ($pager->hasMultiplePages())
                <div class="lineup-results__pager">
                    @include('common.pager', ['pager' => $pager])
                </div>
            @endif
        </div>
    </section>
@endsection

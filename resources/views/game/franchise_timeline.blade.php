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
            <div><p>TRANSMISSION LOG</p><h2>新着情報一覧</h2></div>
        </header>
        <div class="home-transmission-list">
            @forelse ($events as $event)
                @include('common.transmission_row', ['event' => $event, 'index' => $loop->iteration])
            @empty
                <p class="site-empty-state">現在受信している新着情報はありません。</p>
            @endforelse
            @if ($pager->hasMultiplePages())
                <div class="lineup-results__pager">
                    @include('common.pager', ['pager' => $pager])
                </div>
            @endif
        </div>
    </section>
@endsection

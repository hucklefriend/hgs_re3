@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', '怖さメーター')
@section('current-node-title', '怖さメーター')

@section('current-node-content')
@if (session('success'))
    <div class="alert alert-success mt-3">
        {!! nl2br(e(session('success'))) !!}
    </div>
@endif
@if ($fearMeters->isEmpty())
    <p>
        怖さメーターを入力していないようだ。<br>
        <a href="{{ route('Game.Lineup') }}">ラインナップ</a>からタイトルを探して、怖さメーターを入力してみよう。
    </p>
@endif
@endsection

@section('nodes')
    <div class="site-standard-page__sections my-fear-list" data-grid-aligned-list>
        @foreach ($fearMeters as $fm)
            @php $log = $fearMeterComments[$fm->game_title_id] ?? null; @endphp
            <section class="node my-fear-card" id="fear-meter-{{ $fm->game_title_id }}-node">
                <header class="my-fear-card__header" data-grid-block>
                    <h2>{{ $fm->gameTitle->name }}</h2>
                    <a class="has-site-connection-terminal" href="{{ route('Game.TitleDetail', ['titleKey' => $fm->gameTitle->key]) }}" aria-label="{{ $fm->gameTitle->name }}のタイトル詳細"><span class="site-connection-label">タイトル詳細<x-site.connection-terminal /></span></a>
                </header>
                <div class="my-fear-card__body" data-grid-block style="--fear-meter-position: {{ $fm->fear_meter->value * 25 }}%;">
                    <div class="my-fear-card__summary">
                        <span class="my-fear-card__eyebrow">MY FEAR METER</span>
                        <p class="my-fear-card__rating"><strong>{{ $fm->fear_meter->value }}</strong><span>/ 4</span></p>
                        <p class="my-fear-card__description">{{ $fm->fear_meter->text() }}</p>
                    </div>
                    <div class="title-fear-gauge" aria-hidden="true">
                        <div class="title-fear-gauge__rail">
                            <i class="title-fear-gauge__fill"></i>
                            <span class="title-fear-gauge__marker"></span>
                        </div>
                        <ol class="title-fear-gauge__ticks">
                            @foreach (\App\Enums\FearMeter::cases() as $fearLevel)
                                <li @class(['is-current' => $fearLevel === $fm->fear_meter])>{{ $fearLevel->value }}</li>
                            @endforeach
                        </ol>
                    </div>
                </div>
                @if ($log?->comment)
                    <div class="my-fear-card__comment" data-grid-block><p>{{ $log->comment }}</p></div>
                @endif
                <footer class="my-fear-card__footer" data-grid-block>
                    <a class="my-fear-card__edit has-site-connection-terminal" href="{{ route('User.FearMeter.Form', ['titleKey' => $fm->gameTitle->key, 'from' => 'fear-meter-list']) }}" aria-label="{{ $fm->gameTitle->name }}の怖さメーターを編集"><span class="site-connection-label">怖さメーターを編集<x-site.connection-terminal /></span></a>
                </footer>
            </section>
        @endforeach
        @if ($fearMeters->isNotEmpty())
            <div id="under-pager">
                @include('common.pager', ['pager' => $pager])
            </div>
        @endif
    </div>
@endsection

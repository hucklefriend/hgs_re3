@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', '怖さメーター一覧')
@section('current-node-title', '怖さメーター一覧')

@section('current-node-content')
@if (session('success'))
    <div class="alert alert-success mt-3 relative pr-10">
        <button type="button" class="absolute top-0 right-0 p-2 border-0 bg-transparent cursor-pointer" style="line-height: 1;" onclick="this.closest('.alert').style.display='none'" aria-label="閉じる"><i class="bi bi-x"></i></button>
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
    @foreach ($fearMeters as $fm)
        @php $log = $fearMeterComments[$fm->game_title_id] ?? null; @endphp
        <section class="node" id="fear-meter-{{ $fm->game_title_id }}-node">
            <div class="node-head">
                <span class="node-head-text">
                    <a href="{{ route('Game.TitleDetail', ['titleKey' => $fm->gameTitle->key]) }}">{{ $fm->gameTitle->name }}</a>
                </span>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic">
                <div class="text-sm text-slate-200">
                    {{ $fm->fear_meter->text() }}
                    <span class="text-slate-500 text-xs ml-1">（{{ $fm->fear_meter->value }} / 4）</span>
                </div>

                @if ($log?->comment)
                    <p class="mt-1 text-sm text-slate-300">{{ $log->comment }}</p>
                @endif

                <div class="mt-2 text-xs">
                    <a href="{{ route('User.FearMeter.Form', ['titleKey' => $fm->gameTitle->key, 'from' => 'fear-meter-list']) }}"><i class="bi bi-pencil"></i> 編集</a>
                </div>
            </div>

            @if ($loop->last)
                <div class="node-content basic" id="under-pager">
                    @include('common.pager', ['pager' => $pager])
                </div>
            @endif
        </section>
    @endforeach

@endsection

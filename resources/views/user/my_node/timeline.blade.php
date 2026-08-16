@extends('layout')

@section('title', 'マイタイムライン')
@section('current-node-title', 'マイタイムライン')

@section('current-node-content')
<p class="text-sm text-slate-400">お気に入りタイトルの更新やフォロー中のユーザーの活動を時系列で表示します。</p>
@endsection

@section('nodes')
    @forelse ($events as $event)
        @include('common.timeline_event', ['event' => $event])
    @empty
        <section class="node basic">
            <div class="node-head">
                <span class="node-head-text">新着情報はないようだ。</span>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content basic"></div>
        </section>
    @endforelse

    @include('common.pager', ['pager' => $pager])

@endsection

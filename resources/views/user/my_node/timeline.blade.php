@extends('layout')

@section('title', '更新情報タイムライン')
@section('current-node-title', '更新情報タイムライン')

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

    <section class="node tree-node" id="timeline-footer-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('User.MyNode.Top') }}" class="node-head-text" data-hgn-scope="full">マイノード</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text" data-hgn-scope="full">ルート</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
@endsection

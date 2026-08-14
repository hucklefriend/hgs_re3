@extends('layout')

@section('title', '新着情報タイムライン')
@section('current-node-title', '新着情報タイムライン')

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

    <section class="node tree-node" id="footer-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text">ルート</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @if (is_admin_user())
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('Admin.Manage.RssArticle') }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>
@endsection

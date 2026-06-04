@extends('layout')

@section('title', '新着情報')
@section('current-node-title', '新着情報')

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

    <section class="node tree-node" id="footer-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">近道</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node basic">
                <div class="node-head">
                    <a href="{{ route('Root') }}" class="node-head-text" data-hgn-scope="full">ルート</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
@endsection

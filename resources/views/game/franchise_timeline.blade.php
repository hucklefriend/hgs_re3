@extends('layout')

@section('title', $franchise->name . ' 新着情報')
@section('current-node-title', $franchise->name . ' 新着情報')

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

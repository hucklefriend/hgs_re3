@extends('layout')

@section('title', 'Maker | ホラーゲームネットワーク')
@section('current-node-title', 'Maker')

@section('nodes')

    @foreach ($makers as $maker)
    <section class="node link-node" id="{{ $maker->key }}-link-node">
        <div class="node-head">
            <a href="{{ route('Game.MakerDetail', ['makerKey' => $maker->key]) }}" class="node-head-text">{{ $maker->name }}</a>
            <span class="node-pt">●</span>
        </div>
    </section>
    @endforeach

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">Quick Links</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Entrance') }}" class="node-head-text">Entrance</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
        
            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Game.Platform') }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>
@endsection

@extends('layout')

@section('title', 'Franchises | ホラーゲームネットワーク')

@section('content')
<header class="node">
    <div class="node-head" style="margin-bottom: 10px;">
        <h1>Franchises</h1>
        <span class="node-pt">●</span>
    </div>
</header>
<div class="node-container">

    @foreach ($franchises as $franchise)
    <section class="node link-node" id="search-node">
        <div class="node-head disappear">
            <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="network-link">{{ $franchise->name }}</a>
            <span class="node-pt main-node-pt">●</span>
        </div>
        <div class="sub-node-container"></div>
        <div class="terminal-node-container">
            {!! $franchise->description !!}
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
    @endforeach
</div>

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Franchise') }}">管理</a>
        </div>
    @endif
@endsection

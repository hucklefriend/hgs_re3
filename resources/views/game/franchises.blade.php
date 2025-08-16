@extends('layout')

@section('title', 'Franchises | ホラーゲームネットワーク')
@section('tree-header-title', 'Franchises')

@section('tree-nodes')

    @foreach ($franchises as $franchise)
    <section class="node link-node" id="search-node">
        <div class="node-head invisible">
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

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Franchise') }}">管理</a>
        </div>
    @endif
@endsection

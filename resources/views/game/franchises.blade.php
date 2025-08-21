@extends('layout')

@section('title', 'Franchises | ホラーゲームネットワーク')
@section('tree-header-title', 'Franchises')

@section('tree-nodes')
    <section class="node accordion-node" id="search-node" data-accordion-group="acc1">
        <div class="node-head invisible">
            <a href="" class="network-link">あ</a>
            <span class="node-pt main-node-pt">●</span>
        </div>
        <div class="behind-node-container">
            <div class="behind-node behind-link-node invisible">
                <span class="node-pt">●</span><span>アカイイト</span>
            </div>
            <div class="behind-node behind-link-node invisible">
                <span class="node-pt">●</span><span>identity V</span>
            </div>
            <div class="behind-node behind-link-node invisible">
                <span class="node-pt">●</span><span>OUTLAST</span>
            </div>
        </div>
        <div class="accordion-node-container closed">
            <div class="accordion-node-content">
                aaa<br>
                aaa<br>
                aaa<br>
                aaa<br>
                aaa<br>
                aaa<br>
            </div>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>

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

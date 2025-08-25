@extends('layout')

@section('title', 'Franchises | ホラーゲームネットワーク')
@section('tree-header-title', 'Franchises')

@section('tree-nodes')
    <section class="node accordion-tree-node" id="a-tree" data-accordion-group="acc1">
        <header class="node header-node" id="a-header-node">
            <div class="node-head invisible">
                <button class="accordion-expand-button header-node-text" type="button" aria-expanded="false" aria-controls="acc1-a" id="acc-btn-a">あ</button>
                <span class="node-pt">●</span>
            </div>
        </header>
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
        <div class="accordion-tree-node-container tree-container" id="acc1-a">
            <div class="accordion-node-content">
                @foreach ($franchises as $franchise)
                <section class="node link-node" id="search-node">
                    <div class="node-head invisible">
                        {{-- <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="network-link">{{ $franchise->name }}</a> --}}
                        <a href="{{ route('Game.Franchises') }}" class="network-link">{{ $franchise->name }}</a>
                        <span class="node-pt main-node-pt">●</span>
                    </div>
                    <div class="behind-node-container"></div>
                    <div class="terminal-node-container">
                        {!! $franchise->description !!}
                    </div>
                    <canvas class="node-canvas"></canvas>
                </section>
                @endforeach
            </div>
        </div>
        <canvas class="node-canvas"></canvas>
        <div class="connection-line"></div>
    </section>

    <section class="node accordion-tree-node" id="ka-tree" data-accordion-group="acc1">
        <header class="node header-node" id="ka-header-node">
            <div class="node-head invisible">
                <button class="accordion-expand-button header-node-text" type="button" aria-expanded="false" aria-controls="acc1-ka" id="acc-btn-ka">か</button>
                <span class="node-pt">●</span>
            </div>
        </header>
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
        <div class="accordion-tree-node-container tree-container" id="acc1-ka">
            <div class="accordion-node-content">
                @foreach ($franchises as $franchise)
                <section class="node link-node" id="search-node">
                    <div class="node-head invisible">
                        {{-- <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="network-link">{{ $franchise->name }}</a> --}}
                        <a href="{{ route('Game.Franchises') }}" class="network-link">{{ $franchise->name }}</a>
                        <span class="node-pt main-node-pt">●</span>
                    </div>
                    <div class="behind-node-container"></div>
                    <div class="terminal-node-container">
                        {!! $franchise->description !!}
                    </div>
                    <canvas class="node-canvas"></canvas>
                </section>
                @endforeach
            </div>
        </div>
        <canvas class="node-canvas"></canvas>
        <div class="connection-line"></div>
    </section>

    
    <section class="node content-node" id="privacy-policy-node">
        <div class="node-head invisible">
            <a href="{{ route('PrivacyPolicy') }}" class="content-link" id="privacy-policy-a">Privacy Policy</a>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Franchise') }}">管理</a>
        </div>
    @endif
@endsection

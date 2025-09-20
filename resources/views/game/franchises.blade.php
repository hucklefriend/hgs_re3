@extends('layout')

@section('title', 'Franchises | ホラーゲームネットワーク')
@section('tree-header-title', 'Franchises')

@section('tree-nodes')
    @foreach ($prefixes as $prefix => $words)
        @php $franchises = $franchisesByPrefix[$prefix] ?? []; @endphp
        <section class="node accordion-tree-node" id="{{ $prefix }}-tree" data-accordion-group="acc1" data-accordion-type="auto-close">
            <header class="node header-node" id="{{ $prefix }}-header-node">
                <div class="node-head invisible">
                    <button class="accordion-expand-button header-node-text" type="button" aria-expanded="false" aria-controls="acc1-a" id="acc-btn-a">{{ $words[0] }}</button>
                    <span class="node-pt">●</span>
                </div>
            </header>
            <div class="behind-node-container">
                @foreach ($franchises as $franchise)
                    @if ($loop->iteration > 3)
                        @break
                    @endif
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>{{ $franchise->name }}</span>
                    </div>
                @endforeach
            </div>
            <div class="accordion-tree-node-container tree-container closed" id="acc1-a">
                <div class="accordion-node-content">
                    @foreach ($franchises as $franchise)
                    <section class="node link-node" id="search-node">
                        <div class="node-head invisible">
                            <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="network-link">{{ $franchise->name }}</a>
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
    @endforeach


    <section class="node child-tree-node" id="footer-tree-node">
        <header class="node header-node" id="title-lineup-header-node">
            <div class="node-head invisible">
                <h2 class="header-node-text active">Quick Links</h2>
                <span class="node-pt">●</span>
            </div>
        </header>
        <div class="child-tree-node-container tree-container">

        <section class="node link-node" id="back-to-entrance-node">
            <div class="node-head invisible">
                <a href="{{ route('Entrance') }}" class="network-link">Entrance</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="behind-node-container">
            </div>
            <canvas class="node-canvas"></canvas>
        </section>

        @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node" id="information-node">
                <div class="node-head invisible">
                    <a href="{{ route('Admin.Game.Franchise') }}" class="network-link">管理</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                </div>
                <canvas class="node-canvas"></canvas>
            </section>
        @endif
    </div>
    <canvas class="node-canvas"></canvas>
    <div class="connection-line"></div>
</section>
@endsection

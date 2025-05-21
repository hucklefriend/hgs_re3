@extends('layout')

@section('title', 'Horror Games | ホラーゲームネットワーク')

@section('content')
    <header class="node">
        <div class="node-head" style="margin-bottom: 10px;">
            <h1>Horror Games</h1>
            <span class="node-pt">●</span>
        </div>
    </header>
    <div class="node-container">
        <section class="node" id="horror-games-node">
            <div class="node-head">
                <a href="#" class="network-link">Franchises</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node">
                    <span class="node-pt">●</span><span>アカイイト</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>OUTLAST</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>朝の来ない夜に抱かれて -ETERNAL NIGHT-</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>アノニマス</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>エコーナイト</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>es</span>
                </div>
            </div>
        </section>
        <section class="node" id="platforms-node">
            <div class="node-head">
                <a href="#" class="network-link">Platforms</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node">
                    <span class="node-pt">●</span><span>Steam</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>PlayStation</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>Xbox</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>Nintendo Switch</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>Oculus</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>PSVR</span>
                </div>
            </div>
        </section>
        <section class="node" id="makers-node">
            <div class="node-head">
                <a href="#" class="network-link">Makers</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node">
                    <span class="node-pt">●</span><span>任天堂</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>バンダイナムコ</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>カプコン</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>スクウェア・アニックス</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>FROM SOFTWARE</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>ソニー</span>
                </div>
            </div>
        </section>
        <section class="node" id="entrance-node">
            <div class="node-head">
                <a href="#" class="network-link">Entrance</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
        </section>
        @for($i = 0; $i < 300; $i++)
            <section class="node" id="horror-game-{{ $i }}-node">
                <div class="node-head">
                    <a href="#" class="network-link">Horror Game {{ $i }}</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>
        @endfor
    </div>
@endsection

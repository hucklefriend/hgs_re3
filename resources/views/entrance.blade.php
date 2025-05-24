@extends('layout')

@section('title', 'Entrance | ホラーゲームネットワーク')

@section('content')
    <header class="node">
        <div class="node-head" style="margin-bottom: 10px;">
            <h1>Horror Game Network</h1>
            <span class="node-pt">●</span>
        </div>
    </header>
    <div class="node-container">
        <section class="node link-node" id="horror-games-node">
            <div class="node-head">
                <a href="#" class="network-link">Horror Games</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node">
                    <span class="node-pt">●</span><span>Franchises</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>Makers</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>Platforms</span>
                </div>
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
        {{--
        <section class="node" id="information-node">
            <div class="node-head">
                <a href="#" class="network-link">Informations</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node">
                    <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
                </div>
                <div class="sub-node">
                    <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
                </div>
            </div>
        </section>
        <section class="node" id="about-node">
            <div class="node-head">
                <a href="#" class="content-link">About</a>
            </div>
        </section>
        <section class="node" id="privacy-policy-node">
            <div class="node-head">
                <a href="#" class="content-link">Privacy Policy</a>
            </div>
        </section>
        --}}
    </div>
@endsection

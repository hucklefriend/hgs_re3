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
            <div class="node-head disappear">
                <a href="#" class="network-link">Horror Games</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Franchises</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Makers</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>Platforms</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>ABCDEFG</span>
                </div>
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
        <section class="node link-node" id="information-node">
            <div class="node-head disappear">
                <a href="#" class="network-link">Informations</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
            <div class="sub-node-container">
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
                </div>
                <div class="sub-node sub-link-node disappear">
                    <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
                </div>
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
        <section class="node content-node" id="about-node">
            <div class="node-head disappear">
                <a href="{{ route('About') }}" class="content-link">About</a>
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
        <section class="node content-node" id="privacy-policy-node">
            <div class="node-head disappear">
                <a href="{{ route('PrivacyPolicy') }}" class="content-link">Privacy Policy</a>
            </div>
            <canvas class="node-canvas"></canvas>
        </section>
    </div>
@endsection

@extends('layout')

@section('title', 'Entrance | ホラーゲームネットワーク')
@section('current-node-title', 'Horror Game Network')

@section('nodes')

    <section class="node tree-node" id="horror-games-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">Horror Games</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-node" id="search-link-node">
                <div class="node-head">
                    <a href="#" class="node-head-text">Search</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <canvas class="node-canvas"></canvas>
            </section>

            <section class="node link-node" id="franchises-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.Franchises') }}" class="node-head-text">Franchises</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="behind-node-container">
                    <div class="behind-node behind-link-node">
                        <span class="node-pt">●</span><span>アカイイト</span>
                    </div>
                    <div class="behind-node behind-link-node">
                        <span class="node-pt">●</span><span>アオイシロ</span>
                    </div>
                    <div class="behind-node behind-link-node">
                        <span class="node-pt">●</span><span>バイオハザード</span>
                    </div>
                </div>
                <canvas class="node-canvas"></canvas>
            </section>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>

    <section class="node link-node" id="information-node">
        <div class="node-head">
            <a href="#" class="node-head-text">Informations</a>
            <span class="node-pt">●</span>
        </div>
        <div class="behind-node-container">
            <div class="behind-node behind-link-node invisible">
                <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
            </div>
            <div class="behind-node behind-link-node invisible">
                <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
            </div>
            <div class="behind-node behind-link-node invisible">
                <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
            </div>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
    <section class="node link-node" id="about-node">
        <div class="node-head">
            <a href="{{ route('About') }}" class="node-head-text" id="about-a">About</a>
            <span class="node-pt">●</span>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
    <section class="node link-node" id="privacy-policy-node">
        <div class="node-head">
            <a href="{{ route('PrivacyPolicy') }}" class="node-head-text" id="privacy-policy-a">Privacy Policy</a>
            <span class="node-pt">●</span>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
@endsection

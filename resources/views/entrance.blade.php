@extends('layout')

@section('title', 'Entrance | ホラーゲームネットワーク')
@section('tree-header-title', 'Horror Game Network')

@section('tree-nodes')
    <section class="node child-tree-node" id="horror-games-tree-node">
        <header class="node header-node" id="horror-games-header-node">
            <div class="node-head invisible">
                <h2 class="header-node-text active">Horror Games</h2>
                <span class="node-pt">●</span>
            </div>
        </header>
        <div class="child-tree-node-container tree-container">
            <section class="node link-node" id="search-link-node">
                <div class="node-head invisible">
                    <a href="#" class="network-link">Search</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                </div>
                <canvas class="node-canvas"></canvas>
            </section>

            <section class="node link-node" id="franchises-link-node">
                <div class="node-head invisible">
                    <a href="{{ route('Game.Franchises') }}" class="network-link">Franchises</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>アカイイト</span>
                    </div>
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>アオイシロ</span>
                    </div>
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>バイオハザード</span>
                    </div>
                </div>
                <canvas class="node-canvas">
                </canvas>
            </section>
            <section class="node link-node" id="makers-link-node">
                <div class="node-head invisible">
                    <a href="{{ route('Entrance') }}" class="network-link">Makers</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>コナミ</span>
                    </div>
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>カプコン</span>
                    </div>
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>エニックス</span>
                    </div>
                </div>
                <canvas class="node-canvas">
                </canvas>
            </section>
            <section class="node link-node" id="platforms-link-node">
                <div class="node-head invisible">
                    <a href="#" class="network-link">Platforms</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>PC</span>
                    </div>
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>PS5</span>
                    </div>
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>Xbox Series X</span>
                    </div>
                    <div class="behind-node behind-link-node invisible">
                        <span class="node-pt">●</span><span>Nintendo Switch</span>
                    </div>
                </div>
                <canvas class="node-canvas"></canvas>
            </section>
        </div>
        <canvas class="node-canvas"></canvas>
        <div class="connection-line"></div>
    </section>


    <section class="node link-node" id="information-node">
        <div class="node-head invisible">
            <a href="#" class="network-link">Informations</a>
            <span class="node-pt main-node-pt">●</span>
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
    <section class="node content-node" id="about-node">
        <div class="node-head invisible">
            <a href="{{ route('About') }}" class="content-link" id="about-a">About</a>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
    <section class="node content-node" id="privacy-policy-node">
        <div class="node-head invisible">
            <a href="{{ route('PrivacyPolicy') }}" class="content-link" id="privacy-policy-a">Privacy Policy</a>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
@endsection

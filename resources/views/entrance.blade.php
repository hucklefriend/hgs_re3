@extends('layout')

@section('title', 'Entrance | ホラーゲームネットワーク')
@section('tree-header-title', 'Horror Game Network')

@section('tree-nodes')
    <section class="node sub-tree-node" id="horror-games-node">
        <div class="node-head disappear">
            <a href="{{ route('Game.HorrorGames') }}" class="network-link">Horror Games</a>
            <span class="node-pt main-node-pt">●</span>
        </div>
        <div class="sub-node-container">
            <div class="sub-node sub-link-node disappear">
                <span class="node-pt">●</span><span>Search</span>
            </div>
            <div class="sub-node sub-link-node disappear">
                <span class="node-pt">●</span><span>Franchises</span>
            </div>
            <div class="sub-node sub-link-node disappear">
                <span class="node-pt">●</span><span>Makers</span>
            </div>
            <div class="sub-node sub-link-node disappear">
                <span class="node-pt">●</span><span>Platforms</span>
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
            <a href="{{ route('About') }}" class="content-link" id="about-a">About</a>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
    <section class="node content-node" id="privacy-policy-node">
        <div class="node-head disappear">
            <a href="{{ route('PrivacyPolicy') }}" class="content-link" id="privacy-policy-a">Privacy Policy</a>
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
@endsection

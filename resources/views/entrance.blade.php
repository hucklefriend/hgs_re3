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
                    <span class="node-pt">●</span>
                </div>
            </section>

            <section class="node link-node" id="franchises-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.Franchises') }}" class="node-head-text">Franchises</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content behind">
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>バイオハザード</span>
                    </div>
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>サイレントヒル</span>
                    </div>
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>零</span>
                    </div>
                </div>
            </section>

            <section class="node link-node" id="platform-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.Platform') }}" class="node-head-text">Platforms</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content behind">
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>Nintendo Switch 2</span>
                    </div>
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>PlayStation 5</span>
                    </div>
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>Xbox Series X</span>
                    </div>
                </div>
            </section>

            <section class="node link-node" id="maker-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.Maker') }}" class="node-head-text">Makers</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content behind">
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>カプコン</span>
                    </div>
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>コナミ</span>
                    </div>
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>コーエーテクモ</span>
                    </div>
                </div>
            </section>
        </div>
    </section>
    <section class="node link-node" id="information-node">
        <div class="node-head">
            <a href="#" class="node-head-text">Informations</a>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content behind">
            <div class="behind-node">
                <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
            </div>
            <div class="behind-node">
                <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
            </div>
            <div class="behind-node">
                <span class="node-pt">●</span><span>2025.5.5 メンテナンスのお知らせ</span>
            </div>
        </div>
    </section>
    
    <section class="node link-node" id="about-node">
        <div class="node-head">
            <a href="{{ route('About') }}" class="node-head-text" id="about-a">About</a>
            <span class="node-pt">●</span>
        </div>
    </section>
    <section class="node link-node" id="privacy-policy-node">
        <div class="node-head">
            <a href="{{ route('PrivacyPolicy') }}" class="node-head-text" id="privacy-policy-a">Privacy Policy</a>
            <span class="node-pt">●</span>
        </div>
    </section>
@endsection

@extends('layout')

@section('title', 'Draw Check | ホラーゲームネットワーク')

@section('content')
    {{--
    <div class="node node-right">
        <div class="link-node">
            SignIn
        </div>
    </div>
    --}}
    <div class="node" style="margin-top: 10rem;margin-bottom: 10rem;">
        <div id="entrance-node">
            <a href="{{ route('Game.HorrorGameNetwork') }}" class="fade" data-ref-type="map">
                <h1>HorrorGame Network</h1>

                <p>
                    Enter the horror game.
                </p>
            </a>
            <canvas id="entrance-node-canvas"></canvas>
        </div>
    </div>
    <noscript>
        <style>
            #entrance-node {
                > a {
                    pointer-events: auto !important;
                }
            }
        </style>
    </noscript>

    <section class="info">
        <div class="node">
            <h2 class="head2 fade" id="h2-info">Information</h2>
        </div>

        <div class="node">
            <div class="text-node fade" id="no-info">
                現在、お知らせはありません。<br>
                何かあればTwitterでお知らせします。<br>
                <a href="https://twitter.com/horrorgame_net" target="_blank">Twitter</a>

            </div>
        </div>

        <div class="node" style="margin-top: 50px;">
            <div class="link-node small fade" id="old-info">
                <a href="{{ route('InfoNetwork') }}">過去のお知らせ</a>
            </div>
        </div>

        <div class="node" style="margin-top: 20px;">
            <div class="text-node fade" id="additional-info">
                <p>他の情報を確認するには、以下のリンクをご覧ください。</p>
            </div>
        </div>
    </section>

    <section style="margin-top: 100vh;">
        <div class="node">
            <h2 class="head2 fade" id="h2-nm">Network Map</h2>
        </div>

        <div class="node-map">
            <div>
                <div class="link-node fade" data-sub="m" id="franchise-node">
                    <a href="{{ route('Game.FranchiseNetwork') }}">Franchise</a>
                </div>
            </div>
        </div>

        <div style="margin-top:50px;margin-bottom:50px;">
            <div class="node-map">
                <div>
                    <div class="content-link-node fade" id="about-node">
                        <a href="{{ route('About') }}">About</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

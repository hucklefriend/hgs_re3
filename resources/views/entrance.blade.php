@extends('layout')

@section('title', 'Entrance | ホラーゲームネットワーク')

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

    {{--
    <section style="margin-bottom: 30px;">
        <h2 class="head2">News</h2>
        <div class="news-node">
            <div>
                <div class="node">
                    <div class="link-node">
                        日本の都市伝説「きさらぎ駅」をベースにしたホラーアドベンチャー「嵐と山の彼方」，3月29日にSteamでリリース
                    </div>
                </div>

                <div class="node">
                    <div class="link-node">
                        甦った名作サバイバルホラー「Alone in the Dark」，日本語字幕付きのリリーストレイラー公開
                    </div>
                </div>

                <div class="node">
                    <div class="link-node">
                        サバイバルホラー「Alone in the Dark」本日発売。本作の前日譚を描く無料体験版も公開中
                    </div>
                </div>

                <div class="node">
                    <div class="link-node">
                        サバイバルホラー「バイオハザード RE:4」，発売から約1年で全世界での販売本数が700万本を突破
                    </div>
                </div>

                <div class="node">
                    <div class="link-node">
                        クトゥルフ神話にインスパイアされたホラーゲーム続編「The Sinking City 2」発表。2025年に発売
                    </div>
                </div>
            </div>
        </div>
    </section>
--}}
    <section class="info">
        <div class="node">
            <h2 class="head2 fade" id="h2-info">Information</h2>
        </div>

        @if ($infoList->isEmpty())
            <div class="node">
                <div class="text-node fade" id="no-info">
                    現在、お知らせはありません。
                </div>
            </div>
        @else
            @foreach ($infoList as $info)
                <div class="node">
                    <div class="content-link-node fade">
                        <a href="{{ route('Info', $info) }}">{{ $info->head }}</a>
                    </div>
                </div>
            @endforeach
        @endempty

        <div class="node" style="margin-top: 50px;">
            <div class="link-node small fade" id="old-info">
                <a href="{{ route('InfoNetwork') }}">過去のお知らせ</a>
            </div>
        </div>
    </section>

    <section>
        <div class="node">
            <h2 class="head2 fade" id="h2-nm">Network Map</h2>
        </div>

        <div class="node-map">
            <div>
                <div class="link-node fade" data-sub="m" id="franchise-node">
                    <a href="{{ route('Game.FranchiseNetwork') }}">Franchise</a>
                </div>
            </div>
            <div>
                <div class="link-node fade" data-sub="m" id="maker-node">
                    <a href="{{ route('Game.MakerNetwork') }}">Maker</a>
                </div>
            </div>
            <div>
                <div class="link-node fade" data-sub="m" id="platform-node">
                    <a href="{{ route('Game.PlatformNetwork') }}">Platform</a>
                </div>
            </div>
            {{--
            <div>
                <div class="link-node">
                    Tag
                </div>
            </div>
            <div>
                <div class="link-node">
                    Review
                </div>
            </div>
            <div>
                <div class="link-node">
                    SignIn
                </div>
            </div>
            <div>
                <div class="link-node">
                    SighUp
                </div>
            </div>
            <div>
                <div class="link-node">
                    MyPage
                </div>
            </div>
            --}}
        </div>

        <div style="margin-top:50px;margin-bottom:50px;">
            <div class="node-map">
                <div>
                    <div class="content-link-node fade" id="about-node">
                        <a href="{{ route('About') }}">About</a>
                    </div>
                </div>
                <div>
                    <div class="content-link-node fade" id="privacy-policy-node">
                        <a href="{{ route('PrivacyPolicy') }}">PrivacyPolicy</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer style="margin: 50px 0;">
        <div class="node node-center">
            <div class="text-node fade">
                &copy; 2003-{{ date('Y') }} ホラーゲームネットワーク
            </div>
        </div>
    </footer>
@endsection

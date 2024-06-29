@extends('layout')

@section('title', 'Entrance.hgn')

@section('content')
    {{--
    <div class="node node-right">
        <div class="link-node">
            SignIn
        </div>
    </div>
    --}}
    <div class="node node-center" style="margin-top: 10rem;margin-bottom: 10rem;">
        <div class="link-node link-node-center" id="n-HGS">
            <a href="{{ route('Game.HorrorGameNetwork') }}">
                <h1>HorrorGame Network</h1>

                <p>
                    Enter the horror game.
                </p>
            </a>

            <canvas id="n-HGS-c"></canvas>
        </div>
    </div>

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
        <h2 class="head2">Information</h2>

        @empty($infoList)
            <div class="node">
                <div class="text-node">
                    現在、お知らせはありません。
                </div>
            </div>
        @else
            @foreach ($infoList as $info)
                <div class="node">
                    <div class="content-link-node">
                        <a href="{{ route('Info', $info) }}">{{ $info->head }}</a>
                    </div>
                </div>
            @endforeach
        @endempty

        <div class="node node-right">
            <div class="link-node link-node-small">
                <a href="{{ route('InfoNetwork') }}">More</a>
            </div>
        </div>
    </section>

    <section style="margin-top:100px;">
        <h2 class="head2">Network Map</h2>

        <div class="node-map">
            <div>
                <div class="link-node" data-sub="m" id="franchise-node">
                    <a href="{{ route('Game.FranchiseNetwork') }}">Franchise</a>
                </div>
            </div>
            <div>
                <div class="link-node" data-sub="m" id="maker-node">
                    <a href="{{ route('Game.MakerNetwork') }}">Maker</a>
                </div>
            </div>
            <div>
                <div class="link-node" data-sub="m" id="platform-node">
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
                    <div class="content-link-node" id="about-node">
                        <a href="{{ route('About') }}">About</a>
                    </div>
                </div>
                <div>
                    <div class="content-link-node" id="privacy-policy-node">
                        <a href="{{ route('PrivacyPolicy') }}">PrivacyPolicy</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer style="margin: 50px 0;">
        <div class="node node-center">
            <div class="text-node">
                &copy; 2003-{{ date('Y') }} ホラーゲームネットワーク
            </div>
        </div>
    </footer>
@endsection

@extends('layout')

@section('content')
    <div class="node-list">
        <div class="node node-right">
            <div class="link-node">
                Sign In / Sign Up
            </div>
        </div>
        <div class="node node-center" style="margin-top: 10rem;margin-bottom: 10rem;">
            <div class="link-node link-node-center" id="n-HGS">
                <h1>HorrorGame Network</h1>

                <p style="margin-top: 1.5rem;margin-bottom: 0.5rem;">
                    Enter the horror game.<br>
                    ネットワークのノードとなって、<br>
                    ホラーゲームと繋がりましょう！
                </p>
            </div>
        </div>
        <div class="news-node" style="margin-bottom: 30px;">
            <div class="node">
                <div class="link-node">
                    News
                </div>
            </div>

            <div style="margin-left: 30px;">
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

        <div class="news-node" style="margin-top: 100px;margin-bottom: 30px;">
            <div class="node">
                <div class="link-node">
                    Information
                </div>
            </div>

            <div style="margin-left: 30px;">
                <div class="node">
                    <div class="link-node">
                        メンテナス実施のお知らせ
                    </div>
                </div>

                <div class="node">
                    <div class="link-node">
                        メンテナス実施のお知らせ
                    </div>
                </div>

                <div class="node">
                    <div class="link-node">
                        メンテナス実施のお知らせ
                    </div>
                </div>

                <div class="node">
                    <div class="link-node">
                        メンテナス実施のお知らせ
                    </div>
                </div>
            </div>
        </div>
        <div style="height: 1200px;"></div>

        <div class="node node-center" style="margin-top: 5rem;margin-bottom: 5rem;">
            <div class="link-node link-node-center">
                Enter the horror game.
            </div>
        </div>

        <div class="node node-around" style="margin-top: 100px;">
            <div style="margin-bottom: 20px;">
                <div class="link-node link-node-small">
                    About
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <div class="link-node link-node-small">
                    <a href="{{ route('privacy') }}">Privacy Policy</a>
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <div class="link-node link-node-small">
                    Site Map
                </div>
            </div>
        </div>
        <div class="node node-center">
            <div class="text-node">
                &copy; 2003-{{ date('Y') }} ホラーゲームネットワーク
            </div>
        </div>
    </div>
@endsection

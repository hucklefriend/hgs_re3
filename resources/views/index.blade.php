@extends('layout')

@section('content')
    <div class="node node-right">
        <div class="link-node">
            Sign In / Sign Up
        </div>
    </div>
    <div class="node node-center" style="margin-top: 10rem;margin-bottom: 10rem;">
        <div class="link-node link-node-center" id="n-HGS">
            <h1>HorrorGame Network</h1>

            <p style="margin-top: 1.5rem;margin-bottom: 0.5rem;">
                <a href="{{ route('Game.HorrorGameNetwork') }}">Enter the horror game.</a><br>
                ネットワークのノードとなって、<br>
                ホラーゲームと繋がりましょう！
            </p>
        </div>
    </div>

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

    <section class="news-node" style="margin-top: 100px;margin-bottom: 30px;">
        <h2 class="head2">Information</h2>

        <div>
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
    </section>

    <section style="margin-top:100px;">
        <h2 class="head2">Network Map</h2>

        <div class="node-lineup">
            <div>
                <div class="link-node">
                    フランチャイズ
                </div>
            </div>
            <div>
                <div class="link-node">
                    メーカー
                </div>
            </div>
            <div>
                <div class="link-node">
                    プラットフォーム
                </div>
            </div>
            <div>
                <div class="link-node">
                    ジャンル
                </div>
            </div>
            <div>
                <div class="link-node">
                    レビュー
                </div>
            </div>
            <div>
                <div class="link-node">
                    日記
                </div>
            </div>
        </div>

        <div style="margin-top:50px;margin-bottom:50px;">
            <div class="node-lineup">
                <div>
                    <div class="content-link-node">
                        About
                    </div>
                </div>
                <div>
                    <div class="content-link-node">
                        <a href="{{ route('PrivacyPolicy') }}">Privacy Policy</a>
                    </div>
                </div>
                <div>
                    <div class="link-node">
                        Site Map
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

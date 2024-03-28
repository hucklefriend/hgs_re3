@extends('layout')

@section('content')
    <div id="title-node">
        <h1>HorrorGame Network</h1>
        <p class="title-node-text">
            ホラーゲームの最新情報や詳細データをお届けします。<br>
            さらにユーザー登録すればレビューや二次創作など自分の怖い！好き！を発信できます。
        </p>
    </div>
    <div class="node-list">
        <div class="node node-right">
            <div class="link-node">
                Sign In / Sign Up
            </div>
        </div>
        <div class="node node-center" style="margin-top: 10rem;margin-bottom: 10rem;">
            <div class="link-node link-node-center">
                <div style="font-size: 18px; margin-bottom: 1rem;">HorrorGame Search</div>

                <p class="title-node-text">
                    あなたの好きな恐怖を見つけましょう
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

        <div class="news-node" style="margin-bottom: 30px;">
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
        <div class="node node-around" style="margin-top: 100px;">
            <div class="link-node">
                About
            </div>
            <div class="link-node">
                <a href="{{ route('privacy') }}">Privacy Policy</a>
            </div>
            <div class="link-node">
                Site Map
            </div>
        </div>
        <div class="node node-center">
            <div class="text-node">
                &copy; ホラーゲームネットワーク since 2003
            </div>
        </div>
    </div>
@endsection

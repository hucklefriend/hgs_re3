@extends('layout')

@section('title', 'About | ホラーゲームネットワーク')
@section('current-node-title', 'About')

@section('nodes')

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">ホラーゲームネットワークとは？</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                ホラーゲーム好きのためのコミュニティサイトです。<br>
                レビューや二次創作など、みなさんの「好き」を共有し合って楽しんでください。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">ホラーゲームの定義</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                これはとても難しい問題です。<br>
                ホラーゲームとは"怖さ"を楽しむゲームです。<br>
                ですが怖さの感じ方は人それぞれ。<br>
                「あんなゲーム、ホラーゲームじゃない」なんて意見もあるでしょう。<br>
                そこで当サイトでは、以下の条件を満たすゲームをホラーゲームとして扱っています。
            </p>
            <ul>
                <li>メーカーが「ホラーゲーム」として販売している</li>
                <li>プレイアブルキャラクターがずっと怖がっている</li>
                <li><a href="https://vndb.org/" target="_blank">vndb</a>でhorrorタグが付いている</li>
            </ul>
            <p>
                例えば、「ディノクライシス」シリーズは1のみホラーゲームとして販売されていますが、2以降はアクションゲームとして販売されています。<br>
                そのため、1のみ当サイトで扱っています。<br>
                また、恐怖演出がほとんどない「ルイージマンション」はプレイアブルキャラクターであるルイージがずっと怖がっているので当サイトで扱っています。<br>
                カジュアルなホラーゲームや、ホラーコメディも当サイトでは取り扱います。<br>
                <br>
                ゾンビや悪魔といったホラー的なものが出るものの、上記の定義に当てはまらないため取り扱っていないゲームもあります。<br>
                「デッドライジング」や「デビルメイクライ」などがそれに当たります。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">タイトル</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                当サイトでは1つゲームソフトのことを「タイトル」と呼んでいます。<br>
                ゲームタイトルには複数の「パッケージ」が存在する場合があります。<br>
                例えば"零～zero～"には"FATAL FRAME"というパッケージもあります。<br>
                これらは分けずに同じタイトルとして扱っています。<br>
                <br>
                また、タイトルは「シリーズ」や「フランチャイズ」に属しています。<br>
                シリーズは同一ナンバリングのタイトル群です。<br>
                フランチャイズはそれらやメディアミックスなどを1つにまとめたグループのことです。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">リメイクと移植とリマスター</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                リメイクは別のタイトルとして扱います。<br>
                移植やリマスターは同一タイトルとして扱います。<br>
                <br>
                "零～紅い蝶～"を例に紹介します。<br>
                "零～紅い蝶～"はPS2版以外にも、XBOX移植版の"FATAL FRAME2"というパッケージがあります。<br>
                "FATAL FRAME2"は移植なので、レビュー等は"零～紅い蝶～"として扱います。<br>
                リメイクの"零～真紅の蝶～"及び"零～紅い蝶～ REMAKE"は別のタイトルとして扱います。<br>
                <br>
                もう一つ、"BIOHAZARD"を例に紹介します。<br>
                初代"BIOHAZARD"と、そのリメイク"biohazard"は別のタイトルとして扱います。<br>
                リマスターの"biohazard HDリマスター"は"biohazard"として扱います。
            </p>
        </div>
    </section>
    <section class="node">
        <div class="node-head">
            <span class="node-head-text">問い合わせ先</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                不具合等の問い合わせは下記のSNSでお願いします。<br>
            </p>
            <ul>
                <li><a href="https://x.com/huckle_friend">X（管理人の個人アカウント）</a></li>
                <li><a href="https://bsky.app/profile/webmaster.horrorgame.net">Bluesky(管理人の個人アカウント)</a></li>
            </ul>
            <p>
                スパムが多いのでメールでの問い合わせには対応していません。<br>
                <br>
                また、個人で運営しているためパスワード忘れ以外のサポートはなかなか難しいです。<br>
                ご理解頂ける方のみの利用をお願いします。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">画像生成AIの利用</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                下記は画像生成AI(DALL-E3)を使って生成しました。
            </p>
            <ul>
                <li>・<a href="{{ asset('img/ai/favicon.png') }}" target="_blank">ファビコン</a></li>
                <li>・<a href="{{ asset('img/ai/bg3.jpg') }}" target="_blank">背景</a></li>
            </ul>
            <p>
                タイトル、プラットフォームやフランチャイズ等の紹介文はAI(ChatGPT)が生成した文章を加筆修正したものが一部あります。
            </p>
        </div>
    </section>

    <section class="node">
        <div class="node-head">
            <span class="node-head-text">利用画像</span>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>
                下記の素材サイト様から、素材を利用させて頂いてます。
            </p>
            <ul>
                <li>・<a href="https://pixabay.com/" target="_blank">Pixabay</a></li>
                <li>・<a href="https://icon-pit.com/" target="_blank">icon-pit</a></li>
            </ul>
        </div>
    </section>

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">Quick Links</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('About') }}" class="node-head-text">Entrance</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
            </section>
        </div>
    </section>
@endsection

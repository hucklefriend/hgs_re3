@section('content-node-title', 'About')

@section('link-node-id', 'about-node')

@section('content-node-body')
    <section>
        <h2><i class="bi bi-octagon"></i>ホラーゲームネットワークとは？</h2>
        <p>
            ホラーゲーム好きのためのコミュニティサイトです。<br>
            レビューや二次創作など、みなさんの「好き」を共有し合って楽しんでください。
        </p>
    </section>
    <section>
    <h2><i class="bi bi-octagon"></i>ホラーゲームの定義</h2>
        <p>
            これはとても難しい問題です。<br>
            ホラーゲームとは”怖さ”を楽しむゲームです。<br>
            ですが怖さの感じ方は人それぞれ。<br>
            「あんなゲーム、ホラーゲームじゃない」なんて意見もあるでしょう。<br>
            そこで当サイトでは、以下の条件を満たすゲームをホラーゲームとして扱っています。
        </p>
        <ul>
            <li>メーカーが「ホラーゲーム」として販売している</li>
            <li>プレイアブルキャラクターがずっと怖がっている</li>
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
    </section>
    <section>
        <h2><i class="bi bi-octagon"></i>タイトル</h2>
        <p>
            当サイトでは1つゲームソフトのことを「タイトル」と呼んでいます。<br>
            ゲームタイトルには複数の「パッケージ」が存在する場合があります。<br>
            例えば”零～zero～”には”FATAL FRAME”というパッケージもあります。<br>
            これらは分けずに同じタイトルとして扱っています。<br>
            <br>
            また、タイトルは「シリーズ」や「フランチャイズ」に属しています。<br>
            シリーズは同一ナンバリングのタイトル群です。<br>
            フランチャイズはそれらやメディアミックスなどを1つにまとめたグループのことです。
        </p>
    </section>
    <section>
       <h2><i class="bi bi-octagon"></i>リメイクと移植とリマスター</h2>
        <p>
            リメイクは別のタイトルとして扱います。<br>
            移植やリマスターは同一タイトルとして扱います。<br>
            <br>
            ”零～紅い蝶～”を例に紹介します。<br>
            ”零～紅い蝶～”はPS2版以外にも、XBOX移植版の”FATAL FRAME2”というパッケージがあります。<br>
            これらは同じタイトルなので、”FATAL FRAME2”のレビュー等は”零～紅い蝶～”として扱います。<br>
            リメイクの”零～真紅の蝶～”は別のタイトルとして扱います。<br>
            <br>
            もう一つ、”BIOHAZARD”を例に紹介します。<br>
            初代”BIOHAZARD”と、そのリメイク”biohazard”は別のタイトルとして扱います。<br>
            ”biohazard HDリマスター”は”biohazard”として扱います。
        </p>
    </section>

    <section>
        <h2><i class="bi bi-octagon"></i>問い合わせ先</h2>
        <p>
            不具合等の問い合わせは下記のSNSでお願いします。<br>
        </p>
        <ul>
            <li><a href="https://x.com/huckle_friend">X（管理人の個人アカウント）</a></li>
            <li><a href="https://bsky.app/profile/webmaster.horrorgame.net">Bluesky(管理人の個人アカウント)</a></li>
        </ul>
        <p>
            スパムが多いのでメールでの問い合わせには対応していません。<br>
            ご了承ください。
        </p>
        <p>
            個人で運営しているため、サポートはなかなか難しいです。<br>
            ご理解頂ける方のみの利用をお願いします。
        </p>
    </section>

    <section>
        <h2><i class="bi bi-octagon"></i>画像生成AIの利用</h2>
        <p>
            下記は画像生成AI(DALL-E3)を使って生成しました。
        </p>
        <ul>
            <li>・<a href="{{ asset('img/ai/favicon.png') }}" target="_blank">ファビコン</a></li>
            <li>・<a href="{{ asset('img/ai/bg3.jpg') }}" target="_blank">背景</a></li>
        </ul>
        <p>
            ゲーム、プラットフォームやフランチャイズ等の紹介文はAI(ChatGPT)が生成した文章を加筆修正したものが一部あります。
        </p>
    </section>

    <section>
        <h2><i class="bi bi-octagon"></i>利用画像</h2>
        <p>
            下記の素材サイト様から、素材を利用させて頂いてます。
        </p>
        <ul>
            <li>・<a href="https://pixabay.com/" target="_blank">Pixabay</a></li>
            <li>・<a href="https://icon-pit.com/" target="_blank">icon-pit</a></li>
        </ul>
    </section>
@endsection

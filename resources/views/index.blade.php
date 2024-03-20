<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ホラーゲームネットワーク</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="icon" href="{{ asset('favicon.ico') }}">

    <link href="{{ asset('app.css') }}?t={{ time() }}" rel="stylesheet">
</head>
<body>
<div style="padding: 30px;">
    <div id="title-node">
        <h1>HorrorGame Network</h1>
    </div>
    <p>
        ホラーゲームの最新ニュースや新旧ホラーゲームの詳しい情報、ユーザーによるレビューを見られます。<br>
        さらにユーザー登録すればレビューや二次創作など自分の怖い！好き！を発信できます。
    </p>
    <div class="node-list">
        <div class="node">
            <div class="child-node">
                Sign In / Sign Up
            </div>
        </div>
        <div class="node">
            <div class="child-node">
                HorrorGame Search
            </div>
        </div>
        <div class="node">
            <div class="child-node">
                News
            </div>
        </div>
        <div class="node">
            <div class="child-node">
                Information
            </div>
        </div>
        <div class="node">
            <div class="child-node">
                About
            </div>
        </div>
        <div class="node">
            <div class="child-node">
                <a href="{{ route('privacy') }}">Privacy Policy</a>
            </div>
        </div>
        <div class="node">
            <div class="child-node">
            Site Map
            </div>
        </div>
    </div>
    <canvas id="lineCanvas" style="position: absolute;top:0;left:0; z-index: -1000;backdrop-filter: blur(1px);"></canvas>
    <canvas id="backgroundCanvas1" style="position: absolute;top:0;left:0; z-index: -1001;backdrop-filter: blur(2px);"></canvas>
    <div style="position: fixed;top:0;left:0; z-index: -1002;overflow:hidden;width: 100vw;height:100vh;">
        <canvas id="backgroundCanvas2" style="position: absolute;top:0;left:0; z-index: -1002;"></canvas>
    </div>
    <div style="position: fixed;top:0;left:0; z-index: -1003;overflow:hidden;width: 100vw;height:100vh;">
        <canvas id="backgroundCanvas3" style="position: absolute;top:-50px;left:-50px; z-index: -1003;"></canvas>
    </div>
</div>
<script src="{{ asset('app.js') }}?t={{ time() }}"></script>
</body>
</html>

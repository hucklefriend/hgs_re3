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
        <h1>ホラーゲームネットワーク</h1>
    </div>
    <div class="node-list">
        <div class="node">
            <div class="node-item">
                Horror Game Lineup
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            Login / Sign Up
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            About
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            Privacy Policy
            </div>
        </div>
        <div class="node">
            <div class="node-item">
            Site Map
            </div>
        </div>
    </div>
    <canvas id="lineCanvas" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
    <canvas id="backgroundCanvas1" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
    <canvas id="backgroundCanvas2" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
    <canvas id="backgroundCanvas3" style="position: absolute;top:0;left:0; z-index: -100;"></canvas>
</div>
<script src="{{ asset('app.js') }}?t={{ time() }}"></script>
</body>
</html>

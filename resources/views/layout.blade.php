<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ホラーゲームネットワーク</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="icon" href="{{ asset('favicon.ico') }}">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
<div>
@yield('content')
    <canvas id="main-canvas"></canvas>
    <canvas id="bg1" style=""></canvas>
    <canvas id="bg2" style="position: absolute;top:0;left:0; z-index: -1002;"></canvas>
    <div id="bg3c">
        <canvas id="bg3"></canvas>
    </div>
</div>
<div id="debug"></div>
</body>
</html>

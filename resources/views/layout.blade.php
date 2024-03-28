<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ホラーゲームネットワーク</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="icon" href="{{ asset('favicon.ico') }}">
    <link href="{{ asset('assets/plugins/simple-line-icons/css/simple-line-icons.css') }}" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
<div id="container">
@yield('content')
    <div style="height: 30px;"></div>
    <canvas id="main-canvas"></canvas>
    <canvas id="bg1" style=""></canvas>
    <canvas id="bg2" style="position: absolute;top:0;left:0; z-index: -1002;"></canvas>
    <div id="bg3c">
        <canvas id="bg3"></canvas>
    </div>
</div>
<div id="debug" style="visibility: hidden;"></div>
</body>
</html>

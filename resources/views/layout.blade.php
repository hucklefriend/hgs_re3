<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'ホラーゲームネットワーク')</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="icon" href="{{ asset('favicon.ico') }}">
    <link href="{{ asset('assets/plugins/simple-line-icons/css/simple-line-icons.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/plugins/bootstrap-icons/font/bootstrap-icons.css') }}" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP&display=swap" rel="stylesheet">
    <script>
        window.Laravel = {!! json_encode(['csrfToken' => csrf_token()]) !!};
        window.baseUrl = '{{ url('/') }}';
    </script>
    @vite(['resources/css/app.css', 'resources/css/head.css', 'resources/css/node.css', 'resources/js/app.js'])
</head>
<body>
<div id="scroller">
    <div class="container">
        <main>
            @yield('content')
        </main>
    </div>
    <canvas id="main-canvas"></canvas>
    <canvas id="bg1" style=""></canvas>
    <canvas id="bg2" style="position: absolute;top:0;left:0; z-index: -1002;"></canvas>
    <div id="bg3c">
        <canvas id="bg3"></canvas>
    </div>
</div>
<div id="content-node-blur"></div>
<div id="content-node" class="content-node-closed">
    <canvas id="content-node-canvas"></canvas>
    <div id="content-node-header">
        <h1 id="content-node-title"></h1>
        <div class="content-node-close"><i class="icon-close"></i></div>
    </div>
    <div id="content-node-body"></div>
    <div id="content-node-footer">
        <div class="content-node-close"><i class="icon-close"></i></div>
    </div>
</div>
<div id="popups">
    @yield('popup')
</div>
<div id="debug" style="visibility: hidden;"></div>
</body>
</html>

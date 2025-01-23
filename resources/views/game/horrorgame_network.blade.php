<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'ホラーゲームネットワーク')</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="16x16 32x32 48x48 64x64 128x128 256x256" type="image/x-icon">
    <script>
        window.Laravel = @json(['csrfToken' => csrf_token()]);
        window.baseUrl = '{{ url('/') }}';
    </script>
    @vite(['resources/css/app.css', 'resources/css/head.css', 'resources/css/node.css', 'resources/js/main-network.js'])
</head>
<body id="main-network">
<canvas id="main-network-canvas"></canvas>
</body>
<div id="main-network-debug"></div>
<canvas id="main-network-debug-canvas"></canvas>
<script>
    window.addEventListener('load', () => {
        window.mainNetwork.start(@json($networks), {{ $rect['left'] }}, {{ $rect['right'] }}, {{ $rect['top'] }}, {{ $rect['bottom'] }}, 0, 0);
    });
</script>
</html>

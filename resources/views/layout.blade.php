<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'ホラーゲームネットワーク')</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="16x16 32x32 48x48 64x64 128x128 256x256" type="image/x-icon">
    <link href="{{ asset('assets/plugins/simple-line-icons/css/simple-line-icons.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/plugins/bootstrap-icons/font/bootstrap-icons.css') }}" rel="stylesheet">
    <script>
        window.Laravel = @json(['csrfToken' => csrf_token()]);
        window.baseUrl = '{{ url('/') }}';
        window.lazyCss = @json([]);

        @isset($contentData)
            window.content = @json($contentData);
        @else
            window.content = null;
        @endif

        @isset($ratingCheck)
            window.ratingCheck = @json($ratingCheck);
        @else
            window.ratingCheck = false;
        @endif
    </script>
    @vite(['resources/css/app.css', 'resources/ts/app.ts'])
</head>
<body>
    <main>
        <div class="tree-view">
            @yield('content')
            <div id="main-line"></div>
            <div id="free-pt">●</div>
        </div>
        <div id="content-node-view">
            <div id="content-node-view-header">
                <div></div>
                <header>
                    <h1></h1>
                    <span id="content-node-view-close">×</span>
                </header>
            </div>
            <div id="content-node-view-content">
            </div>
            <footer>
            </footer>
        </div>
    </main>
</body>
</html>

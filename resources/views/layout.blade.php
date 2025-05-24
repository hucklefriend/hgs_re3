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
    <main class="" style="position:relative;">
        @yield('content')
        <div style="position:absolute;left:30px;top:13px;height:100%;border-left:2px solid #66ff66;box-shadow: 0 0 10px 0 rgba(102, 255, 102, 0.5);"></div>
    </main>
</body>
</html>

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
    <main class="mx-auto max-w-[700px] px-4">
        @yield('content')
    </main>
    <footer class="mx-auto max-w-[700px] px-4">
        <div class="footer-content" style="display: flex; align-items: center;">
            <div style="display: inline-block;">
                <svg width="13" height="13" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="color: #66ff66;">
                <circle cx="70" cy="90" r="12" fill="currentColor" />
                <path d="M70 90 Q 20 100, 30 10" fill="none" stroke="currentColor" stroke-width="6" marker-end="url(#arrow)" />
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,6 L3,3 L0,0" fill="currentColor" />
                  </marker>
                </defs>
              </svg>
            </div>

            <p>Back</p>
        </div>
    </footer>

    <canvas id="canvas"></canvas>
    <div id="bg1"></div>
</body>
</html>

@php
    $siteName = 'ホラーゲームネットワーク(α)';
    $ogpTitle = $ogpTitle ?? $siteName;
    $ogpDescription = $ogpDescription ?? 'ホラーゲーム好きのためのコミュニティサイトです。レビューや二次創作など、みなさんの「好き」を共有し、より深くホラーゲームを楽しんでほしいという想いで運営しています。';
    $ogpImage = $ogpImage ?? asset('images/ogp.png');
    $ogpUrl = $ogpUrl ?? url()->current();
    $ogpType = $ogpType ?? 'website';
@endphp
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', '') | {{ $siteName }}</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport">
    {{-- OGP: ビューで @section('ogp') を定義するか、$ogpTitle / $ogpDescription / $ogpImage / $ogpUrl / $ogpType を渡すと上書き --}}
    @hasSection('ogp')
        @yield('ogp')
    @else
        @include('common.ogp_meta', [
            'siteName' => $siteName,
            'ogpTitle' => $ogpTitle,
            'ogpDescription' => $ogpDescription,
            'ogpImage' => $ogpImage,
            'ogpUrl' => $ogpUrl,
            'ogpType' => $ogpType,
        ])
    @endif
    <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="16x16 32x32 48x48 64x64 128x128 256x256" type="image/x-icon">
    {{-- <link href="{{ asset('assets/plugins/simple-line-icons/css/simple-line-icons.css') }}" rel="stylesheet"> --}}
    <link href="{{ asset('assets/plugins/bootstrap-icons/font/bootstrap-icons.css') }}" rel="stylesheet">
    <script>
        window.Laravel = @json(['csrfToken' => csrf_token()]);
        window.baseUrl = '{{ url('/') }}';
        window.lazyCss = @json([]);
        window.siteName = '{{ $siteName }}';
        window.components = @json($components ?? []);
    </script>
    @vite(['resources/css/app.css', 'resources/ts/app.ts'])
</head>
<body class="@isset($colorState) has-{{ $colorState }} @endisset py-4">
    <main>
        <section class="node" id="current-node">
            <div class="node-head">
                <h1 class="node-head-text">@yield('current-node-title')</h1>
                <span class="node-pt current-node-pt">●</span>
            </div>
            
            <div class="node-content" id="current-node-content">
                @hasSection('current-node-content')
                    @yield('current-node-content')
                @endif
            </div>

            <div class="node-content tree" id="current-tree-nodes">
                @yield('nodes')
            </div>
        </section>
    </main>

    <footer>
        &copy; 2003-{{ date('Y') }} ホラーゲームネットワーク
    </footer>
</body>
</html>

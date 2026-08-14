@php
    $siteName = 'ホラーゲームネットワーク(β)';
    $ogpTitle = $ogpTitle ?? $siteName;
    $ogpDescription = $ogpDescription ?? 'ホラーゲーム好きのためのコミュニティサイトです。レビューや二次創作など、みなさんの「好き」を共有し、より深くホラーゲームを楽しんでほしいという想いで運営しています。';
    $ogpImage = $ogpImage ?? '/img/ogp.png';
    $ogpUrl = $ogpUrl ?? url()->current();
    $ogpType = $ogpType ?? 'website';
    $routeName = request()->route()?->getName() ?? 'default';
    $pageKind = $pageKind ?? str($routeName)->replace('.', ' ')->kebab()->toString();
    $pageTitle = trim($__env->yieldContent('title', ''));
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
    <link rel="icon" type="image/png" href="{{ asset('favicon-96x96.png') }}" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}" />
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}" />
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}" />
    <link rel="manifest" href="{{ asset('site.webmanifest') }}" />
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
<body
    class="@isset($colorState) has-{{ $colorState }} @endisset @yield('body-class')"
    data-public-app
    data-navigation-mode="document"
    data-page-kind="{{ $pageKind }}"
    data-page-ready="false"
>
    <x-site.grid-plane />
    <a class="site-skip-link" href="#site-main">本文へ移動</a>
    <x-site.header :page-kind="$pageKind" />

    <main class="site-main" id="site-main">
        @hasSection('site-content')
            @yield('site-content')
        @else
        <div class="site-frame">
            <div class="site-main__grid">
                <div class="site-grid-axis" aria-hidden="true">
                    <span>NETWORK GRID / {{ strtoupper($pageKind) }}</span>
                    <span>X:<b data-grid-columns>16</b> / Y:AUTO</span>
                </div>
                <x-site.breadcrumb :page-kind="$pageKind" :page-title="$pageTitle" />

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
            </div>
        </div>
        @endif
    </main>

    <x-site.footer />
</body>
</html>

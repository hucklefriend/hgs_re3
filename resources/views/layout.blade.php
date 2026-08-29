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
    $pageHeadingLabel = trim($__env->yieldContent('current-node-label', ''));
    if ($pageHeadingLabel === '') {
        if (str_starts_with($pageKind, 'game-title')) {
            $pageHeadingLabel = 'GAME TITLE';
        } elseif (str_starts_with($pageKind, 'game-franchise')) {
            $pageHeadingLabel = 'FRANCHISE';
        } elseif (str_starts_with($pageKind, 'game-platform')) {
            $pageHeadingLabel = 'PLATFORM';
        } elseif (str_starts_with($pageKind, 'game-maker')) {
            $pageHeadingLabel = 'MAKER';
        } elseif (str_starts_with($pageKind, 'game-media-mix')) {
            $pageHeadingLabel = 'MEDIA MIX';
        } elseif ($pageKind === 'game-lineup') {
            $pageHeadingLabel = 'LINEUP';
        } elseif (str_starts_with($pageKind, 'game-review')) {
            $pageHeadingLabel = 'REVIEWS';
        } elseif (str_starts_with($pageKind, 'user-my-node')) {
            $pageHeadingLabel = 'MY NODE';
        } elseif (str_starts_with($pageKind, 'user-profile')) {
            $pageHeadingLabel = 'USER PROFILE';
        } elseif (str_starts_with($pageKind, 'user-review')) {
            $pageHeadingLabel = 'REVIEW';
        } elseif (str_starts_with($pageKind, 'user-fear-meter')) {
            $pageHeadingLabel = 'FEAR METER';
        } elseif (str_starts_with($pageKind, 'user-follow')) {
            $pageHeadingLabel = 'USER';
        } elseif ($pageKind === 'timeline') {
            $pageHeadingLabel = 'TIMELINE';
        } elseif (str_starts_with($pageKind, 'information') || str_starts_with($pageKind, 'infomation')) {
            $pageHeadingLabel = 'INFORMATION';
        } elseif (str_starts_with($pageKind, 'account') || str_starts_with($pageKind, 'two-factor')) {
            $pageHeadingLabel = 'ACCOUNT';
        } elseif (str_starts_with($pageKind, 'contact')) {
            $pageHeadingLabel = 'CONTACT';
        } elseif ($pageKind === 'privacy-policy') {
            $pageHeadingLabel = 'PRIVACY POLICY';
        } elseif ($pageKind === 'about') {
            $pageHeadingLabel = 'ABOUT';
        } elseif ($pageKind === 'rating-check') {
            $pageHeadingLabel = 'AGE VERIFICATION';
        } elseif ($pageKind === 'logo') {
            $pageHeadingLabel = 'BRAND ASSETS';
        } elseif (str_starts_with($pageKind, 'errors')) {
            $pageHeadingLabel = 'ERROR';
        } else {
            $pageHeadingLabel = 'NODE';
        }
    }
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
        document.documentElement.classList.add('has-public-site-js');
        window.Laravel = @json(['csrfToken' => csrf_token()]);
        window.baseUrl = '{{ url('/') }}';
        window.lazyCss = @json([]);
        window.siteName = '{{ $siteName }}';
        window.components = @json($components ?? []);
    </script>
    @vite(['resources/css/app.css', 'resources/ts/app.ts'])
</head>
<body
    class="site-page site-page--{{ $pageKind }} @isset($colorState) has-{{ $colorState }} @endisset @yield('body-class')"
    data-public-app
    data-navigation-mode="document"
    data-page-kind="{{ $pageKind }}"
    data-page-ready="false"
>
    <x-site.grid-plane />
    <a class="site-skip-link" href="#site-main">本文へ移動</a>
    <x-site.header />

    <main class="site-main" id="site-main">
        @hasSection('site-content')
            @yield('site-content')
        @else
        <div class="site-frame site-standard">
            <div class="site-main__grid">
                <x-site.breadcrumb :page-kind="$pageKind" :page-title="$pageTitle" :items="$breadcrumbItems ?? []" />

                <article class="site-standard-page node" id="current-node">
                    <header class="site-standard-page__header node-head">
                        <x-site.page-heading :label="$pageHeadingLabel" title-class="node-head-text">@yield('current-node-title')</x-site.page-heading>
                        @hasSection('current-node-actions')
                            <div class="site-standard-page__actions">
                                @yield('current-node-actions')
                            </div>
                        @endif
                        <span class="node-pt current-node-pt" aria-hidden="true">●</span>
                    </header>

                    @hasSection('page-notice')
                        <aside class="site-standard-notice" role="alert">
                            @yield('page-notice')
                        </aside>
                    @endif

                    @hasSection('current-node-content')
                        <div class="site-standard-page__content node-content" id="current-node-content">
                            @yield('current-node-content')
                        </div>
                    @endif

                    @yield('nodes')
                </article>
            </div>
        </div>
        @endif

        @hasSection('site-footer-action')
            <div class="site-frame">
                <nav class="site-footer-action" aria-label="管理操作">
                    @yield('site-footer-action')
                </nav>
            </div>
        @endif
    </main>

    <x-site.footer />
</body>
</html>

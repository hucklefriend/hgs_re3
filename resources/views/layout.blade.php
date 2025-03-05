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
        window.START_HGN = true;
        window.addEventListener('load', function() {
            window.hgn.start('{{ $viewerType ?? 'document' }}');
        });

        @isset($contentNode)
            window.contentNode = @json($contentNode);
        @else
            window.contentNode = null;
        @endif

        @isset($ratingCheck)
            window.ratingCheck = @json($ratingCheck);
        @else
            window.ratingCheck = false;
        @endif

        @isset($map)
            window.map = "{!! $map !!}"
        @else
            window.map = null;
        @endif

        showBg = () => {
            // 背景画像のURLを取得
            const bg = document.getElementById('bg');
            const bgImg = window.getComputedStyle(bg).backgroundImage;
            const imgUrl = bgImg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

            // 画像の読み込みを監視
            const img = new Image();
            img.onload = () => {
                // 画像読み込み完了後にフェードイン実行
                let opacity = 0;
                let interval = setInterval(() => {
                    opacity += 0.1;
                    bg.style.opacity = opacity;
                    if (opacity >= 1) {
                        clearInterval(interval);
                    }
                }, 100);
            };
            img.src = imgUrl;
        };
    </script>
    @vite(['resources/css/app.css', 'resources/css/head.css', 'resources/css/node.css', 'resources/js/app.js'])
</head>
<body>
<div id="bg" style="opacity: 0;"></div>
<script>showBg();</script>
<div id="canvas-container">
    <canvas id="sub-canvas"></canvas>
    <canvas id="main-canvas"></canvas>
    <div class="scroller-pad" id="canvas-container-pad"></div>
</div>
<div id="document">
    <main>
        @yield('content')
        <div class="scroller-pad" id="document-pad"></div>
    </main>
</div>
<div id="map"></div>
<div id="content-node-blur"></div>
<div id="content-node" class="content-node-closed">
    <canvas id="content-node-canvas"></canvas>
    <div id="content-node-container">
        <div id="content-node-header">
            <h1 id="content-node-title"></h1>
            <div class="content-node-close"><i class="icon-close"></i></div>
        </div>
        <div id="content-node-body"></div>
        <div id="content-node-footer">
            <div class="content-node-close"><i class="icon-close"></i></div>
        </div>
    </div>
</div>
<div id="popups">
    @yield('popup')
</div>
<div>
    <script>
        function iamOver18() {
            document.cookie = "over18=true; path=/"; // Cookieを設定
            window.hgn.closePopupNode('rating-check-popup');
            window.hgn.appear();
        }
    </script>
    <div class="popup-node" id="rating-check-popup">
        <div class="popup-container">
            <h1>年齢確認</h1>
            <p>
                この先、18歳未満の方が購入できないゲームタイトルの情報が含まれます。<br>
                18歳未満の方は閲覧をご遠慮ください。
            </p>

            <div>
                <a href="{{ route('Entrance') }}">エントランスに戻る</a>
                <a href="#" onclick="iamOver18();">18歳以上です</a>
            </div>
        </div>
    </div>
</div>
<div id="loading"><img src="{{ asset('img/loading.gif') }}" alt="now loading..."></div>
<div id="debug" style="visibility: hidden;"></div>
</body>
</html>

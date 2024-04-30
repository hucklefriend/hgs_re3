@extends('layout')

@section('content')
    <div class="node-list">
        <div class="link-node">
            <a href="{{ route('HGN') }}"><i class="icon-arrow-left"></i></a>
        </div>


        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">{{ $title->name }}</h1>
        </div>

        <div class="node node-center">
            <div class="text-node">
                <blockquote>
                    {!! nl2br(e($title->introduction))  !!}

                    <footer style="text-align: right;margin-top:1rem;">— <cite>{!! $title->introduction_from  !!}</cite></footer>
                </blockquote>
            </div>
        </div>
        <div class="node-lineup">
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
        </div>

        <div class="node">
            <h2 class="head2">
                レビュー総評
            </h2>
        </div>
        <div class="node">
            <div class="text-node" style="white-space: nowrap;">
                怖さ：★★★★☆<br>
                グラフィック：★★★★☆<br>
                サウンド：★★★★☆<br>
                ストーリー：★★★★☆<br>
                ゲーム性：★★★★☆
            </div>
            <div class="text-node" style="margin-left:1rem;min-width:300px;">
                要約<br>
                このゲームはとても怖いです。グラフィックもサウンドも素晴らしいです。ストーリーも面白いです。ゲーム性も高いです。
            </div>
        </div>


        <div class="node">
            <h2 class="head2">
                コンテンツ
            </h2>
        </div>
        <div class="node-lineup">
            <div>
                <div class="link-node">
                    <a href="#test">レビュー</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">二次創作</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">攻略</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">日記</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">辞書</a>
                </div>
            </div>
        </div>

        <div class="node">
            <h2 class="head2">
                パッケージ・関連商品
            </h2>
        </div>
        <div class="node-lineup">
            @foreach ($packages as $package)
                <div>
                    <div class="content-link-node">
                        <a href="#test">
                            {{ $package->acronym }}
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
        <div class="node-lineup">
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
        </div>
    </div>


@endsection

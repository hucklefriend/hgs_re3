@extends('layout')

@section('title', 'タイトルネットワーク.HGN')

@section('content')
    <div class="node-list">
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

        <div class="node">
            <h2 class="head2">
                レビュー総評
            </h2>
        </div>
        <div class="node-review-ge">
            <div class="text-node" style="white-space: nowrap;">
                怖さ：★★★★☆<br>
                グラフィック：★★★★☆<br>
                サウンド：★★★★☆<br>
                ストーリー：★★★★☆<br>
                ゲーム性：★★★★☆
            </div>
            <div class="text-node">
                要約<br>
                このゲームはとても怖いです。グラフィックもサウンドも素晴らしいです。ストーリーも面白いです。ゲーム性も高いです。
            </div>
        </div>

        <div class="node">
            <h2 class="head2">
                タグネットワーク
            </h2>
        </div>

        <div class="node-lineup">
            <div>
                <div class="link-node">
                    <a href="#test">アドベンチャー</a>
                </div>
            </div>
            <div>
                <div class="link-node">
                    <a href="#test">和風</a>
                </div>
            </div>
        </div>


        <div class="node">
            <h2 class="head2">
                ユーザーコンテンツネットワーク
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

        <div class="node">
            <h2 class="head2">
                関連ネットワーク
            </h2>
        </div>
        <div class="node-lineup">
            @if ($title->franchise()->getTitleNum() > 1)
                <div>
                    <div class="link-node link-node-center">
                        <a href="{{ route('Game.FranchiseDetailNetwork', $title->franchise()) }}">
                            {{ $title->franchise()->node_title }}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            @endif

            @foreach ($makers as $maker)
                <div>
                    <div class="link-node link-node-center">
                        <a href="#test">
                            {{ $maker->node_title }}
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>



    @include('footer')
@endsection

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
            <h2 class="head2">タグ</h2>
        </div>

        <div class="node-map">
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
            <h2 class="head2">ユーザーコンテンツ</h2>
        </div>
        <div class="node-map">
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
            <h2 class="head2">パッケージ</h2>
        </div>
            @foreach ($packages as $pkg)
                <div style="display:flex;margin-bottom:1rem;">
                    <div>
                        <div class="text-node" style="white-space: nowrap;text-align: center;">
                            @if ($pkg->img_s_url !== null)
                                <div>
                                    <img src="{{ $pkg->img_s_url }}" alt="{{ $pkg->name }}" style="max-width:100px;max-height:100px;">
                                </div>
                            @endif
                            【{{ $pkg->platform->acronym }}】{{ $pkg->acronym }}<br>
                            {{ $pkg->release_at }}発売
                        </div>
                    </div>
                    <div class="node-map" style="width:100%">
                        @foreach($pkg->shops as $shop)
                            <div>
                                <div class="link-node">
                                    <a href="{{ $shop->url }}" target="_blank" rel="sponsored">
                                        <i class="bi bi-shop"></i> {{ $shop->shop()->name }}
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach

        <div class="node">
            <h2 class="head2">関連商品</h2>
        </div>
        <div class="node-map">
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
        <div class="node-map">
            @if ($title->franchise()->getTitleNum() > 1)
                <div>
                    <div class="link-node link-node-center">
                        <a href="{{ route('Game.FranchiseDetailNetwork', $title->franchise()) }}">
                            {{ $title->franchise()->node_name }}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            @endif

            @foreach ($makers as $maker)
                <div>
                    <div class="link-node link-node-center">
                        <a href="{{ route('Game.MakerDetailNetwork', $maker) }}">
                            {!! $maker->node_name !!}
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>



    @include('footer')
@endsection

@extends('layout')

@section('title', 'タイトルネットワーク.HGN')

@section('content')
    <div style="text-align:center; margin: 20px 0;">
        <h1 class="head1">{{ $title->name }}</h1>
    </div>

    @if (!empty($title->description))
        <section>
            <div class="node node-center">
                <div class="text-node">
                    @include('common.description', ['model' => $title])
                </div>
            </div>
        </section>
    @endif

    <section>
    <div class="node">
        <h2 class="head2">レビュー総評</h2>
    </div>
    <div class="title-review">
        <div class="text-node review-score">
            <div class="review-score-fear">
                <span>怖さ</span>
                <span>★★★★☆</span>
            </div>
            <div class="review-score-other">
                <div>
                    <span>グラフィック</span>
                    <span>★★★★☆</span>
                </div>
                <div>
                    <span>サウンド</span>
                    <span>★★★★☆</span>
                </div>
                <div>
                    <span>ストーリー</span>
                    <span>★★★★☆</span>
                </div>
                <div>
                    <span>ゲーム性</span>
                    <span>★★★★☆</span>
                </div>
            </div>
        </div>
        <div class="text-node">
            <h3>AIによる要約</h3>
            このゲームはとても怖いです。グラフィックもサウンドも素晴らしいです。ストーリーも面白いです。ゲーム性も高いです。
        </div>
    </div>
    </section>

    <section>
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
    </section>

    <section>
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
    </section>

    <section>
        <div class="node">
            <h2 class="head2">パッケージ</h2>
        </div>
        <div class="product-list">
            @foreach ($packages as $pkg)
                <div class="product-info">
                    <div class="text-node">
                        @if ($pkg->img_s_url !== null)
                            <div>
                                <img src="{{ $pkg->img_s_url }}" alt="{{ $pkg->name }}">
                            </div>
                        @endif
                        {!! $pkg->node_name !!}
                        <div style="margin-top: 10px;">
                            {{ $pkg->platform->name }}<br>
                            {{ $pkg->release_at }}
                        </div>

                        @if ($pkg->shops->count() > 0)
                            <div style="margin-top: 10px;" class="shop-link">
                                @foreach($pkg->shops as $shop)
                                    <a href="{{ $shop->url }}" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                                        <i class="bi bi-shop"></i> {{ $shop->shop()->name }}
                                    </a>
                                @endforeach
                                <a href="" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                                    <i class="bi bi-shop"></i> メルカリで探す
                                </a>
                                <a href="" target="_blank" rel="sponsored" style="white-space: nowrap;margin-right: 1rem;">
                                    <i class="bi bi-shop"></i> 楽天で探す
                                </a>
                            </div>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    <section>
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
    </section>

    <section>
    <div class="node">
        <h2 class="head2">
            関連ネットワーク
        </h2>
    </div>
        <div class="node-map">
            @if ($title->franchise()->getTitleNum() > 1)
                <div>
                    <div class="link-node link-node-center">
                        <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $title->franchise()->key]) }}">
                            {{ $title->franchise()->node_name }}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            @endif

            @foreach ($makers as $maker)
                <div>
                    <div class="link-node link-node-center">
                        <a href="{{ route('Game.MakerDetailNetwork', ['makerKey' => $maker->key]) }}">
                            {!! $maker->node_name !!}
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    @include('footer')
@endsection

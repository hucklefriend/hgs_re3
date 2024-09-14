@extends('layout')

@section('title', $title->name . ' | ホラーゲームネットワーク')

@section('content')
    <div class="node h1">
        <h1 class="head1 fade">{!! $title->h1_node_name !!}</h1>
    </div>

    @if (!empty($title->description))
        <section>
            <div class="node node-center">
                <div class="text-node fade">
                    @include('common.description', ['model' => $title])
                </div>
            </div>
        </section>
    @endif

    {{--
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
--}}
    <section>
        <div class="node">
            <h2 class="head2 fade">パッケージ</h2>
        </div>
            @if ($title->packageGroups()->exists())
                @foreach ($title->packageGroups->sortByDesc('sort_order') as $pkgGroup)
                    @empty($pkgGroup->description)
                        <div class="node h3">
                            <h3 class="head3 fade">{{ $pkgGroup->node_name }}</h3>
                        </div>
                    @else
                        <div class="node h3">
                            <h3 class="head3 fade" style="margin-bottom: 5px;">
                                {{ $pkgGroup->node_name }}
                            </h3>
                        </div>
                        <div class="node">
                            <div class="text-node small fade">
                                {!! nl2br($pkgGroup->description) !!}
                            </div>
                        </div>
                    @endif

                    <div class="product-list" style="margin-bottom: 50px;">
                        @foreach ($pkgGroup->packages->sortBy([['sort_order', 'desc'], ['game_platform_id', 'desc']]) as $pkg)
                            @include('common.package', ['pkg' => $pkg, 'isGroup' => true])
                        @endforeach
                    </div>
                @endforeach
            @else
                <div class="product-list" style="margin-bottom: 50px;">
                    @foreach ($title->packages->sortByDesc('sort_order') as $pkg)
                        @include('common.package', ['pkg' => $pkg])
                    @endforeach
                </div>
            @endif
    </section>

    @if ($title->mediaMixes()->exists())
        <section>
            <div class="node">
                <h2 class="head2 fade">メディアミックス</h2>
            </div>
            <div class="node-map">
                @foreach ($title->mediaMixes as $mm)
                    <div>
                        <div class="link-node link-node-center fade">
                            <a href="{{ route('Game.MediaMixDetailNetwork', ['mediaMixKey' => $mm->key]) }}">
                                {!! $mm->node_name !!}
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>
    @endif

    @include('common.related_products', ['model' => $title])

    <section>
        <div class="node">
            <h2 class="head2 fade">
                関連ネットワーク
            </h2>
        </div>
        <div class="node-map">
            @if ($title->series)
                @foreach ($title->series->titles as $sameSeriesTitle)
                    @if ($sameSeriesTitle->id === $title->id)
                        @continue
                    @endif
                    <div>
                        <div class="link-node link-node-center fade">
                            <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $sameSeriesTitle->key]) }}">
                                {!! $sameSeriesTitle->node_name !!}
                            </a>
                        </div>
                    </div>
                @endforeach
            @endif

            @if ($title->getFranchise()->getTitleNum() > 1)
                <div>
                    <div class="link-node link-node-center fade">
                        <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $title->getFranchise()->key]) }}">
                            {{ $title->getFranchise()->node_name }}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            @endif

            @foreach ($makers as $maker)
                <div>
                    <div class="link-node link-node-center fade">
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

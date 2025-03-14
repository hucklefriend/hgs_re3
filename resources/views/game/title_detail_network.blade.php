@extends('layout')

@section('title', $title->name . ' | ホラーゲームネットワーク')

@section('ratingCheck', $title->rating == \App\Enums\Rating::None ? "false" : "true")

@section('content')
    @include('common.head1', ['model' => $title])

    @if (!empty($title->issue))
    <section>
        <div class="node">
            <div class="text-node fade" id="issue">
                <p style="color: #FFFF55;text-align:center;margin-bottom:1rem;">
                    ⚠️ このタイトルをホラーゲームと扱うことに疑義があります
                </p>

                <p>
                    {!! nl2br(e($title->issue)) !!}
                </p>
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

    @if ($title->packageGroups()->exists() || $title->packages()->exists())
        <section>
            <div class="node">
                <h2 class="head2 fade" id="h2_package">パッケージ</h2>
            </div>
            @if ($title->packageGroups()->exists())
                @foreach ($title->packageGroups->sortByDesc('sort_order') as $pkgGroup)
                    @empty($pkgGroup->description)
                        <div class="node h3">
                            <h3 class="head3 fade" id="h3_pg_{{ $pkgGroup->id }}">{{ $pkgGroup->node_name }}</h3>
                        </div>
                    @else
                        <div class="node h3">
                            <h3 class="head3 fade" style="margin-bottom: 5px;" id="h3_pg_{{ $pkgGroup->id }}">
                                {{ $pkgGroup->node_name }}
                            </h3>
                        </div>
                        <div class="node">
                            <div class="text-node small fade" id="description_pg_{{ $pkgGroup->id }}">
                                {!! nl2br($pkgGroup->description) !!}
                            </div>
                        </div>
                    @endif

                    @empty($pkgGroup->simple_shop_text)
                        <div class="product-list" style="margin-bottom: 50px;">
                            @foreach ($pkgGroup->packages->sortBy([['sort_order', 'desc'], ['game_platform_id', 'desc'], ['default_img_type', 'desc']]) as $pkg)
                                @include('common.package', ['pkg' => $pkg, 'isGroup' => true])
                            @endforeach
                        </div>
                    @else
                        <div class="node" style="margin-bottom: 50px;margin-top:3px;">
                            <div class="text-node fade" style="text-align:center;">
                                {!! nl2br($pkgGroup->simple_shop_text) !!}
                            </div>
                        </div>
                    @endif
                @endforeach
            @else
                <div class="product-list" style="margin-bottom: 50px;">
                    @foreach ($title->packages->sortByDesc('sort_order') as $pkg)
                        @include('common.package', ['pkg' => $pkg])
                    @endforeach
                </div>
            @endif
        </section>
    @endif

    @if ($title->mediaMixes()->exists())
        <section>
            <div class="node">
                <h2 class="head2 fade" id="h2_media_mix">メディアミックス</h2>
            </div>
            <div class="node-map">
                @foreach ($title->mediaMixes as $mm)
                    <div>
                        <div class="link-node link-node-center fade" id="link_media_mix_{{ $mm->id }}">
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

    @if ($title->series)
        <section>
            <div class="node">
                <h2 class="head2 fade" id="h2_series_titles">シリーズ作品</h2>
            </div>
            <div class="node-map">
                @foreach ($title->series->titles as $sameSeriesTitle)
                    @if ($sameSeriesTitle->id === $title->id)
                        @continue
                    @endif
                    <div>
                        <div class="link-node link-node-center fade" id="link_series_title_{{ $sameSeriesTitle->id }}">
                            <a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $sameSeriesTitle->key]) }}">
                                {!! $sameSeriesTitle->node_name !!}
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>
    @endif


    <section>
        <div class="node">
            <h2 class="head2 fade">
                関連ネットワーク
            </h2>
        </div>
        <div class="node-map">
            @if ($title->getFranchise()->getTitleNum() > 1)
                <div>
                    <div class="link-node link-node-center fade" id="link_franchise_{{ $title->getFranchise()->id }}">
                        <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $title->getFranchise()->key]) }}">
                            {!! $title->getFranchise()->node_name !!}<br>
                            フランチャイズ
                        </a>
                    </div>
                </div>
            @endif

            @foreach ($makers as $maker)
                <div>
                    <div class="link-node link-node-center fade" id="link_maker_{{ $maker->id }}">
                        <a href="{{ route('Game.MakerDetailNetwork', ['makerKey' => $maker->key]) }}">
                            {!! $maker->node_name !!}
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </section>

    @include('footer')

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Title.Detail', $title) }}">管理</a>
        </div>
    @endif
@endsection

@extends('layout')

@section('title', $title->name . ' | ホラーゲームネットワーク')
@section('current-node-title', $title->name)
@section('ratingCheck', $title->rating == \App\Enums\Rating::None ? "false" : "true")

@section('current-node-content')
    @include('common.current-node-ogp', ['model' => $title])
@endsection

@section('nodes')
    @if ($title->packageGroups()->exists())
        <section class="node tree-node" id="pkg-lineup-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">パッケージラインナップ</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($title->packageGroups->sortByDesc('sort_order') as $pkgGroup)
                    <section class="node" id="pkgg-{{ $pkgGroup->id }}-tree-node">
                        <div class="node-head @if (!empty($pkgGroup->description)) node-head-small-margin @endif">
                            <h3 class="node-head-text">{{ $pkgGroup->name }}</h3>
                            <span class="node-pt">●</span>
                        </div>
                        <div class="node-content basic">
                            @if (!empty($pkgGroup->description))
                                <p class="pkg-group-description">{!! nl2br($pkgGroup->description) !!}</p>
                            @endif
                            @foreach ($pkgGroup->packages->sortBy([['sort_order', 'desc'], ['game_platform_id', 'desc'], ['default_img_type', 'desc']]) as $pkg)
                            <div class="pkg-info">
                                <div class="pkg-info-text">
                                    {{ $pkg->platform->acronym }}
                                    @empty($pkg->node_name)
                                    @else
                                        &nbsp;{!! $pkg->node_name !!}
                                    @endif
                                    <br>
                                    <span>{{ $pkg->release_at }}</span>
                                </div>
                                
                                @if ($pkg->shops->count() > 0)
                                <div class="pkg-info-shops">
                                    @foreach($pkg->shops as $shop)
                                    <div class="pkg-info-shop">
                                        <a href="{{ $shop->url }}">
                                            <div class="pkg-info-shop-img">
                                            @if ($shop->ogp !== null && $shop->ogp->image !== null)
                                                <img src="{{ $shop->ogp->image }}" width="{{ $shop->ogp->image_width }}" height="{{ $shop->ogp->image_height }}" class="pkg-img">
                                            @elseif (!empty($shop->img_tag))
                                                {!! $shop->img_tag !!}
                                            @else
                                                <img src="{{ $pkg->default_img_type->imgUrl() }}">
                                            @endif
                                            </div>
                                            <div class="shop-name">
                                                {{ $shop->shop()?->name() ?? '--' }}
                                            </div>
                                        </a>
                                    </div>
                                    @endforeach
                                </div>
                                @endif
                            </div>
                            @endforeach
                        </div>
                    </section>
                @endforeach
            </div>
        </section>
    @endif

    @if ($title->series && $title->series->titles->count() > 1)
        <section class="node tree-node" id="footer-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">シリーズ作品</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($title->series->titles as $sameSeriesTitle)
                @if ($sameSeriesTitle->id === $title->id)
                    @continue
                @endif
                <section class="node link-node" id="{{ $title->key }}-link-node">
                    <div class="node-head">
                        <a href="{{ route('Game.TitleDetail', ['titleKey' => $sameSeriesTitle->key]) }}" class="node-head-text">{{ $sameSeriesTitle->name }}</a>
                        <span class="node-pt">●</span>
                    </div>
                </section>
                @endforeach
            </div>
        </section>
    @endif

    <section class="node tree-node" id="footer-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">Quick Links</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-tree-node" id="admin-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="node-head-text">{{ $franchise->name }}フランチャイズ</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content tree">
                    <section class="node link-tree-node" id="back-to-franchises-node">
                        <div class="node-head">
                            <a href="{{ route('Game.Franchises') }}" class="node-head-text">Franchises</a>
                            <span class="node-pt">●</span>
                        </div>
                        <div class="node-content tree">
                            <section class="node link-node" id="back-to-entrance-node">
                                <div class="node-head">
                                    <a href="{{ route('Entrance') }}" class="node-head-text">Entrance</a>
                                    <span class="node-pt">●</span>
                                </div>
                            </section>
                        </div>
                    </section>
                </div>
            </section>

            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node" id="admin-link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Game.Title.Detail', $title) }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>


@endsection

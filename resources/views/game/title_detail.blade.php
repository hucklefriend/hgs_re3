@extends('layout')

@section('title', $title->name . ' | ホラーゲームネットワーク')
@section('tree-header-title', $title->name)
@section('ratingCheck', $title->rating == \App\Enums\Rating::None ? "false" : "true")

@section('tree-header-content')
    @include('common.head1', ['model' => $title])
@endsection


@section('tree-nodes')

    @if ($title->packageGroups()->exists() || $title->packages()->exists())
        <section class="node child-tree-node" id="title-lineup-tree-node">
            <header class="node header-node" id="title-lineup-header-node">
                <div class="node-head invisible">
                    <h2 class="header-node-text active">パッケージラインナップ</h2>
                    <span class="node-pt">●</span>
                </div>
            </header>
            <div class="child-tree-node-container tree-container">
                @if ($title->packageGroups()->exists())
                    @foreach ($title->packageGroups->sortByDesc('sort_order') as $pkgGroup)
                        <section class="node child-tree-node" id="ああ-tree-node">
                            <header class="node header-node" id="biohazard-series-header-node">
                                <div class="node-head invisible">
                                    <h2 class="header-node-text active">{{ $pkgGroup->name }}</h2>
                                    <span class="node-pt">●</span>
                                </div>
                            </header>
                            <div class="child-tree-node-container tree-container">
                                @foreach ($pkgGroup->packages->sortBy([['sort_order', 'desc'], ['game_platform_id', 'desc'], ['default_img_type', 'desc']]) as $pkg)
                                    @include('common.package', ['pkg' => $pkg])
                                @endforeach
                            </div>
                            <canvas class="node-canvas"></canvas>
                            <div class="connection-line" id="biohazard-series-connection-line"></div>
                        </section>
                    @endforeach
                @else
                    @foreach ($title->packages->sortByDesc('sort_order') as $pkg)
                    @include('common.package', ['pkg' => $pkg])
                    @endforeach
                @endif
            </div>
            <canvas class="node-canvas"></canvas>
            <div class="connection-line"></div>
        </section>

    @endif


    @if ($title->series)
        <section class="node child-tree-node" id="footer-tree-node">
            <header class="node header-node" id="title-lineup-header-node">
                <div class="node-head invisible">
                    <h2 class="header-node-text active">同一シリーズのタイトル</h2>
                    <span class="node-pt">●</span>
                </div>
            </header>
            <div class="child-tree-node-container tree-container">
                @foreach ($title->series->titles as $sameSeriesTitle)
                @if ($sameSeriesTitle->id === $title->id)
                    @continue
                @endif
                <section class="node link-node" id="biohazard-link-node">
                    <div class="node-head invisible">
                        <a href="{{ route('Game.TitleDetail', ['titleKey' => $sameSeriesTitle->key]) }}" class="network-link">{{ $sameSeriesTitle->name }}</a>
                        <span class="node-pt main-node-pt">●</span>
                    </div>
                    <div class="behind-node-container">
                    </div>
                    <canvas class="node-canvas"></canvas>
                </section>
                @endforeach
            </div>
            <canvas class="node-canvas"></canvas>
            <div class="connection-line"></div>
        </section>
    @endif





    <section class="node child-tree-node" id="footer-tree-node">
        <header class="node header-node" id="title-lineup-header-node">
            <div class="node-head invisible">
                <h2 class="header-node-text active">Quick Links</h2>
                <span class="node-pt">●</span>
            </div>
        </header>
        <div class="child-tree-node-container tree-container">

            <section class="node link-node" id="admin-link-node">
                <div class="node-head invisible">
                    <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="network-link">{{ $franchise->name }}フランチャイズ</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                </div>
                <canvas class="node-canvas">
                </canvas>
            </section>




            
            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node" id="admin-link-node">
                <div class="node-head invisible">
                    <a href="{{ route('Admin.Game.Title.Detail', $title) }}" class="network-link">管理</a>
                    <span class="node-pt main-node-pt">●</span>
                </div>
                <div class="behind-node-container">
                </div>
                <canvas class="node-canvas">
                </canvas>
            </section>
            @endif
        </div>
        <canvas class="node-canvas"></canvas>
        <div class="connection-line"></div>
    </section>


@endsection

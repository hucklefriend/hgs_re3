@extends('layout')

@section('title', $title->name . ' | ホラーゲームネットワーク')
@section('current-node-title', $title->name)
@section('ratingCheck', $title->rating == \App\Enums\Rating::None ? "false" : "true")

@section('current-node-content')
    @include('common.head1', ['model' => $title])
@endsection


@section('nodes')

    @if ($title->packageGroups()->exists() || $title->packages()->exists())
        <section class="node tree-node" id="title-lineup-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">パッケージラインナップ</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @if ($title->packageGroups()->exists())
                    @foreach ($title->packageGroups->sortByDesc('sort_order') as $pkgGroup)
                        <section class="node tree-node" id="ああ-tree-node">
                            <div class="node-head">
                                <h2 class="node-head-text">{{ $pkgGroup->name }}</h2>
                                <span class="node-pt">●</span>
                            </div>
                            <div class="node-content tree">
                                @foreach ($pkgGroup->packages->sortBy([['sort_order', 'desc'], ['game_platform_id', 'desc'], ['default_img_type', 'desc']]) as $pkg)
                                    @include('common.package', ['pkg' => $pkg])
                                @endforeach
                            </div>
                        </section>
                    @endforeach
                @else
                    @foreach ($title->packages->sortByDesc('sort_order') as $pkg)
                    @include('common.package', ['pkg' => $pkg])
                    @endforeach
                @endif
            </div>
        </section>
    @endif


    @if ($title->series)
        <section class="node tree-node" id="footer-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">同一シリーズのタイトル</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($title->series->titles as $sameSeriesTitle)
                @if ($sameSeriesTitle->id === $title->id)
                    @continue
                @endif
                <section class="node link-node" id="biohazard-link-node">
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
            <section class="node link-node" id="admin-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="node-head-text">{{ $franchise->name }}フランチャイズ</a>
                    <span class="node-pt">●</span>
                </div>
            </section>

            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node" id="admin-link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Game.Title.Detail', $title) }}" class="node-head-text">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>


@endsection

@extends('layout')

@section('title', 'Horror Game Search | ホラーゲームネットワーク')
@section('current-node-title', 'タイトル検索')

@section('current-node-content')
<form id="search-form" method="GET" action="{{ route('Game.Search') }}">
    <input type="text" id="search-input" value="{{ $text }}">
    <button type="submit">検索</button>
</form>
<script>
    document.getElementById('search-form').addEventListener('submit', e => {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        // urlを生成
        const url = new URL(window.location.href);
        url.searchParams.set('text', searchInput.value);

        window.hgn.currentNode.changeChildNodes(url.toString(), true);
    });
</script>
@endsection

@section('nodes')
@isset($franchises)
    <section class="node {{ $franchises->isNotEmpty() ? 'tree-node' : '' }}">
        <div class="node-head">
            <h2 class="node-head-text">検索結果</h2>
            <span class="node-pt">●</span>
        </div>
        @if ($franchises->isNotEmpty())
        <div class="node-content tree">
            @foreach ($franchises as $franchise)
            <section class="node link-tree-node" id="franchise-{{ $franchise->key }}-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="node-head-text">{{ $franchise->name }} フランチャイズ</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="node-content tree">
                    @foreach ($franchise->series as $series)
                    <section class="node tree-node">
                        <div class="node-head">
                            <h3 class="node-head-text">{{ $series->name }} シリーズ</h3>
                            <span class="node-pt">●</span>
                        </div>
                        <div class="node-content tree">
                            @foreach ($series->titles as $title)
                            <section class="node link-node" id="{{ $title->key }}-link-node">
                                <div class="node-head">
                                    <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="node-head-text">{{ $title->name }}</a>
                                    <span class="node-pt">●</span>
                                </div>
                            </section>
                            @endforeach
                        </div>
                    </section>
                    @endforeach
                    @foreach ($franchise->titles as $title)
                    <section class="node link-node" id="{{ $title->key }}-link-node">
                        <div class="node-head">
                            <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="node-head-text">{{ $title->name }}</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                    @endforeach
                </div>
            </section>
            @endforeach
        </div>
        @else
        <div class="node-content basic">
            条件に合うゲームが見つかりませんでした。
        </div>
        @endif
    </section>
@endisset

<section class="node tree-node">
    <div class="node-head">
        <h2 class="node-head-text">近道</h2>
        <span class="node-pt">●</span>
    </div>
    <div class="node-content tree">
        <section class="node link-node">
            <div class="node-head">
                <a href="{{ route('Root') }}" class="node-head-text">トップ</a>
                <span class="node-pt main-node-pt">●</span>
            </div>
        </section>
    </div>
</section>
@endsection

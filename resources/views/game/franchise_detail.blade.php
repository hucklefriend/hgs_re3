@extends('layout')

@section('title', $franchise->name . 'フランチャイズ | ホラーゲームネットワーク')
@section('tree-header-title', $franchise->name . 'フランチャイズ')


@section('tree-header-content')
    {!! nl2br($franchise->description) !!}
@endsection

@section('tree-nodes')
    <section class="node child-tree-node" id="title-lineup-tree-node">
        <header class="node header-node" id="title-lineup-header-node">
            <div class="node-head invisible">
                <h2 class="header-node-text active">タイトルラインナップ</h2>
                <span class="node-pt">●</span>
            </div>
        </header>
        <div class="child-tree-node-container tree-container">
            @foreach ($franchise->series as $series)
                <section class="node child-tree-node" id="{{ $series->key }}-tree-node">
                    <header class="node header-node" id="biohazard-series-header-node">
                        <div class="node-head invisible">
                            <h2 class="header-node-text active">{{ $series->name }}シリーズ</h2>
                            <span class="node-pt">●</span>
                        </div>
                    </header>
                    <div class="child-tree-node-container tree-container">
                        @foreach ($series->titles as $title)
                        <section class="node link-node" id="biohazard-link-node">
                            <div class="node-head invisible">
                                <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="network-link">{{ $title->name }}</a>
                                <span class="node-pt main-node-pt">●</span>
                            </div>
                            <div class="behind-node-container">
                            </div>
                            <canvas class="node-canvas"></canvas>
                        </section>
                        @endforeach
                    </div>
                    <canvas class="node-canvas"></canvas>
                    <div class="connection-line" id="biohazard-series-connection-line"></div>
                </section>

            @endforeach


            @if ($franchise->titles->count() > 0)
                @foreach ($franchise->titles as $title)
                <section class="node link-node" id="biohazard-link-node">
                    <div class="node-head invisible">
                        <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="network-link">{{ $title->name }}</a>
                        <span class="node-pt main-node-pt">●</span>
                    </div>
                    <div class="behind-node-container">
                    </div>
                    <canvas class="node-canvas"></canvas>
                </section>
                @endforeach
            @endif

        </div>
        <canvas class="node-canvas"></canvas>
        <div class="connection-line"></div>
    </section>


    @if ($franchise->mediaMixGroups->isNotEmpty())

    <section class="node child-tree-node" id="media-mix-tree-node">
        <header class="node header-node" id="media-mix-header-node">
            <div class="node-head invisible">
                <h2 class="header-node-text active">メディアミックス</h2>
                <span class="node-pt">●</span>
            </div>
        </header>
        <div class="child-tree-node-container tree-container">
        @foreach ($franchise->mediaMixGroups->sortBy('sort_order') as $mediaMixGroup)
        <section class="node child-tree-node" id="media-mix-tree-node">
            <header class="node header-node" id="media-mix-header-node">
                <div class="node-head invisible">
                    <h2 class="header-node-text active">{{ $mediaMixGroup->name }}</h2>
                    <span class="node-pt">●</span>
                </div>
            </header>
            <div class="child-tree-node-container tree-container">
                    @if ($franchise->mediaMixGroups->isNotEmpty())
                        @foreach ($mediaMixGroup->mediaMixes->sortBy('sort_order') as $mediaMix)
                        <section class="node link-node" id="biohazard-link-node">
                            <div class="node-head invisible">
                                <a href="#" class="network-link">{{ $mediaMix->name }}</a>
                                <span class="node-pt main-node-pt">●</span>
                            </div>
                            <div class="behind-node-container">
                            </div>
                            <canvas class="node-canvas"></canvas>
                        </section>
                        @endforeach
                    @endif

                </div>
                <canvas class="node-canvas"></canvas>
                <div class="connection-line"></div>
            </section>
            
        @endforeach

    </div>
    <canvas class="node-canvas"></canvas>
    <div class="connection-line"></div>
</section>

    @elseif ($franchise->mediaMixes->isNotEmpty())
    @foreach ($franchise->mediaMixes as $mediaMix)
    <section class="node link-node" id="biohazard-link-node">
        <div class="node-head invisible">
            <a href="#" class="network-link">{{ $mediaMix->name }}</a>
            <span class="node-pt main-node-pt">●</span>
        </div>
        <div class="behind-node-container">
        </div>
        <canvas class="node-canvas"></canvas>
    </section>
    @endforeach
    @endif

@endsection

@extends('layout')

@section('title', $franchise->name . 'フランチャイズ | ホラーゲームネットワーク')
@section('current-node-title', $franchise->name . 'フランチャイズ')

@section('current-node-content')
    <div class="node-content basic">
        {!! nl2br($franchise->description) !!}
    </div>
@endsection

@section('nodes')
    <section class="node tree-node" id="title-lineup-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">タイトルラインナップ</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            @foreach ($franchise->series as $series)
                <section class="node tree-node" id="{{ $series->key }}-tree-node">
                    <div class="node-head">
                        <h2 class="node-head-text">{{ $series->name }}シリーズ</h2>
                        <span class="node-pt">●</span>
                    </div>
                    <div class="node-content tree">
                        @foreach ($series->titles as $title)
                        <section class="node link-node" id="biohazard-link-node">
                            <div class="node-head">
                                <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="node-head-text">{{ $title->name }}</a>
                                <span class="node-pt">●</span>
                            </div>
                        </section>
                        @endforeach
                    </div>
                </section>
            @endforeach

            @if ($franchise->titles->count() > 0)
                @foreach ($franchise->titles as $title)
                <section class="node link-node" id="biohazard-link-node">
                    <div class="node-head">
                        <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="node-head-text">{{ $title->name }}</a>
                        <span class="node-pt">●</span>
                    </div>
                </section>
                @endforeach
            @endif
        </div>
    </section>


    @if ($franchise->mediaMixGroups->isNotEmpty())

    <section class="node tree-node" id="media-mix-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">メディアミックス</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
        @foreach ($franchise->mediaMixGroups->sortBy('sort_order') as $mediaMixGroup)
        <section class="node tree-node" id="media-mix-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">{{ $mediaMixGroup->name }}</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                    @if ($franchise->mediaMixGroups->isNotEmpty())
                        @foreach ($mediaMixGroup->mediaMixes->sortBy('sort_order') as $mediaMix)
                        <section class="node link-node" id="biohazard-link-node">
                            <div class="node-head">
                                <a href="#" class="node-head-text">{{ $mediaMix->name }}</a>
                                <span class="node-pt">●</span>
                            </div>
                        </section>
                        @endforeach
                    @endif

                </div>
            </section>
            
        @endforeach

    </div>
    <canvas class="node-canvas"></canvas>
</section>

    @elseif ($franchise->mediaMixes->isNotEmpty())
        @foreach ($franchise->mediaMixes as $mediaMix)
        <section class="node link-node" id="biohazard-link-node">
            <div class="node-head invisible">
                <a href="#" class="node-head-text">{{ $mediaMix->name }}</a>
                <span class="node-pt">●</span>
            </div>
        </section>
        @endforeach
    @endif

    <section class="node tree-node" id="footer-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">Quick Links</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-node" id="back-to-franchises-node">
                <div class="node-head">
                    <a href="{{ route('Game.Franchises') }}" class="node-head-text">Franchises</a>
                    <span class="node-pt">●</span>
                </div>
                <div class="child-tree-node-container tree-container">
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
@endsection

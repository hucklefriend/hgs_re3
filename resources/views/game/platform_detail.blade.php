@extends('layout')

@section('title', $platform->name . ' | ホラーゲームネットワーク')
@section('current-node-title', $platform->name)

@section('current-node-content')
    <blockquote class="description">
        {!! nl2br($platform->description); !!}
        @if ($platform->description_source !== null)
            <footer>
                — <cite>{!! $platform->description_source !!}</cite>
            </footer>
        @endif
    </blockquote>
@endsection


@section('nodes')

    @if ($platform->relatedProducts->count() > 0)
        <section class="node tree-node" id="hardware-tree-node">
            <div class="node-head">
                <h2 class="node-head-text">ハードウェア</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($platform->relatedProducts as $rp)
                    <section class="node basic" id="{{ $rp->key }}-link-node">
                        <div class="node-head">
                            <h2 class="node-head-text">{{ $rp->name }}</h2>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                @endforeach
            </div>
        </section>
    @endif

    @if ($titles->count() > 0)
    <section class="node tree-node" id="title-tree-node">
        <div class="node-head">
            <h2 class="node-head-text">タイトル</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            @foreach ($titles as $title)
                <section class="node basic" id="{{ $title->key }}-link-node">
                    <div class="node-head">
                        <h2 class="node-head-text">{{ $title->name }}</h2>
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
            <section class="node link-tree-node" id="back-to-platforms-node">
                <div class="node-head">
                    <a href="{{ route('Game.Platform') }}" class="node-head-text">Platforms</a>
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
        
            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Game.Platform.Detail', $platform) }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>
@endsection

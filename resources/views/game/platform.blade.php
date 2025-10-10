@extends('layout')

@section('title', 'Platforms | ホラーゲームネットワーク')
@section('current-node-title', 'Platforms')

@section('nodes')
    @foreach (\App\Enums\GamePlatformType::cases() as $type)
    @if ($platforms->where('type', $type)->count() > 0)
        <section class="node tree-node">
            <div class="node-head">
                <h2 class="node-head-text">{{ $type->text() }}</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content tree">
                @foreach ($platforms->where('type', $type) as $platform)
                    <section class="node link-node" id="{{ $platform->key }}-link-node">
                        <div class="node-head">
                            <a href="{{ route('Game.PlatformDetail', ['platformKey' => $platform->key]) }}" class="node-head-text">{{ $platform->name }}</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                @endforeach
            </div>
        </section>
    @endif
    @endforeach

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">Quick Links</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Entrance') }}" class="node-head-text">Entrance</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
        
            @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
            <section class="node link-node">
                <div class="node-head">
                    <a href="{{ route('Admin.Game.Platform') }}" class="node-head-text" rel="external">管理</a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endif
        </div>
    </section>
@endsection

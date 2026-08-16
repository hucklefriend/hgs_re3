@extends('layout')

@section('title', 'プラットフォーム')
@section('current-node-title', 'プラットフォーム')

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
                    <section class="node basic" id="{{ $platform->key }}-link-node">
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

@endsection

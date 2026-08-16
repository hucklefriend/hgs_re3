@extends('layout')

@section('title', 'ゲームメーカー')
@section('current-node-title', 'ゲームメーカー')

@section('nodes')

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">{{ \App\Enums\GameMakerType::COMMERCIAL->text() }}</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            @foreach ($makers->where('type', \App\Enums\GameMakerType::COMMERCIAL) as $maker)
            <section class="node basic" id="{{ $maker->key }}-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.MakerDetail', ['makerKey' => $maker->key]) }}" class="node-head-text">
                        {{ $maker->name }}
                        @if ($maker->rating == \App\Enums\Rating::R18A)
                        &nbsp;🔞
                        @endif
                    </a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endforeach
        </div>
    </section>

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">{{ \App\Enums\GameMakerType::INDIE->text() }}</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            @foreach ($makers->where('type', \App\Enums\GameMakerType::INDIE) as $maker)
            <section class="node basic" id="{{ $maker->key }}-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.MakerDetail', ['makerKey' => $maker->key]) }}" class="node-head-text">
                        {{ $maker->name }}
                        @if ($maker->rating == \App\Enums\Rating::R18A)
                        &nbsp;🔞
                        @endif
                    </a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endforeach
        </div>
    </section>

    <section class="node tree-node">
        <div class="node-head">
            <h2 class="node-head-text">{{ \App\Enums\GameMakerType::DOUJIN->text() }}</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content tree">
            @foreach ($makers->where('type', \App\Enums\GameMakerType::DOUJIN) as $maker)
            <section class="node basic" id="{{ $maker->key }}-link-node">
                <div class="node-head">
                    <a href="{{ route('Game.MakerDetail', ['makerKey' => $maker->key]) }}" class="node-head-text">
                        {{ $maker->name }}
                        @if ($maker->rating == \App\Enums\Rating::R18A)
                        &nbsp;🔞
                        @endif
                    </a>
                    <span class="node-pt">●</span>
                </div>
            </section>
            @endforeach
        </div>
    </section>

@endsection

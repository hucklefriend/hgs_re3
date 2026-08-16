@extends('layout')

@section('title', 'フランチャイズ')
@section('current-node-title', 'フランチャイズ')

@section('nodes')
    @foreach ($prefixes as $prefix => $words)
        @php $prefixFranchises = $franchisesByPrefix[$prefix] ?? []; @endphp
        <section class="node tree-node" id="{{ $prefix }}-tree">
            <div class="node-head">
                <h2 class="node-head-text">{{ $words[0] }}</h2>
                <span class="node-pt">●</span>
            </div>
            <div class="node-content behind">
                @foreach ($prefixFranchises as $franchise)
                    @if ($loop->iteration > 3)
                        @break
                    @endif
                    <div class="behind-node">
                        <span class="node-pt">●</span><span>{{ $franchise->name }}</span>
                    </div>
                @endforeach
            </div>
            <div class="node-content tree" id="acc1-a">
                @foreach ($prefixFranchises as $franchise)
                <section class="node basic" id="search-node">
                    <div class="node-head">
                        <a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]) }}" class="node-head-text">
                            {{ $franchise->name }}
                            @if ($franchise->rating == \App\Enums\Rating::R18A)
                                &nbsp;🔞
                            @endif
                        </a>
                        <span class="node-pt">●</span>
                    </div>
                    @if ($isOver18 || $franchise->rating != \App\Enums\Rating::R18A)
                    <div class="node-content basic">
                        {!! $franchise->description !!}
                    </div>
                    @endif
                </section>
                @endforeach
            </div>
        </section>
    @endforeach

@endsection

@extends('layout')

@section('title', $maker->name)
@section('current-node-title', $maker->name)

@section('current-node-content')
    <blockquote class="description">
        {!! nl2br($maker->description); !!}
        @if ($maker->description_source !== null)
            <footer>
                — <cite>{!! $maker->description_source !!}</cite>
            </footer>
        @endif
    </blockquote>
@endsection


@section('nodes')


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
                            <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" class="node-head-text">{{ $title->name }}</a>
                            <span class="node-pt">●</span>
                        </div>
                    </section>
                @endforeach
            </div>
        </section>
    @endif

@endsection

@extends('layout')

@section('content')
    <div class="node-list">
        <div class="node node-around">
            <div class="back-node">
                <a href="{{ route('Game.HorrorGameNetwork') }}"><i class="icon-arrow-left"></i></a>
            </div>
            <div class="link-node">
                <i class="bi bi-search"></i>
            </div>
        </div>
        <div class="node-lineup">
        @foreach ($titles as $title)
            <div>
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.TitleNetwork', $title) }}">{!! $title->node_title !!}</a>
                </div>
            </div>
        @endforeach
        </div>
    </div>
@endsection

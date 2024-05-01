@extends('layout')

@section('content')
    <div class="node-list">
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

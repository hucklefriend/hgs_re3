@extends('layout')

@section('content')
    <div class="node-list">
        <div class="node-lineup">
        @foreach ($games as $game)
            <div>
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.FranchiseNetwork', $game) }}">{!! $game->node_title !!}</a>
                </div>
            </div>
        @endforeach
        </div>

    </div>
@endsection

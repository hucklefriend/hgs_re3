@extends('layout')

@section('title', 'HorrorGameNetwork.hgn')

@section('content')

    <div class="node-list">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">HorrorGame Network</h1>
        </div>

        <div class="node node-right">
            <div class="link-node" id="search">
                <i class="bi bi-search"></i>
            </div>
        </div>

        @foreach ($groups as $games)
        <div class="node-lineup">
            @foreach ($games as $game)
                <div>
                    <div class="link-node link-node-center" id="{{ $game->dom_id }}" data-connect="{{ json_encode($game->connections) }}">
                        <a href="{{ route('Game.TitleNetwork',  $game->title) }}">{!! $game->title->node_name !!}</a>
                    </div>
                </div>
            @endforeach
        </div>
        @endforeach


        <div class="node-list node-around" style="margin-top:100px;margin-bottom: 50px;">
            <div>
                @if ($prev)
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.HorrorGameNetwork', ['page' => $prev]) }}">&lt;&lt; Prev</a>
                </div>
                @endif
            </div>
            <div>
                @if ($next)
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.HorrorGameNetwork', ['page' => $next]) }}">Next &gt;&gt;</a>
                </div>
                @endif
            </div>
        </div>

        @include('footer')
    </div>
@endsection

@extends('layout')

@section('content')
    <div class="node-list">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">Maker Network</h1>
        </div>

        <div class="node-map">
            @foreach ($makers as $maker)
                <div>
                    <div class="link-node link-node-center">
                        <a href="{{ route('Game.MakerDetailNetwork', $maker) }}">{!! $maker->node_name !!}</a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    @include('footer')
@endsection

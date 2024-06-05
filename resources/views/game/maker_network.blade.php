@extends('layout')

@section('content')
    <div class="node-list">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">Maker Network</h1>
        </div>

        <div class="node-map">
            @foreach ($makers as $maker)
                <div>
                    <div class="link-node link-node-center" data-sub="{{ $maker->sub_net }}">
                        <a href="{{ route('Game.MakerDetailNetwork', ['makerKey' => $maker->key]) }}">
                            {!! $maker->node_name !!}
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <div class="node-list node-around" style="margin-top:100px;margin-bottom: 50px;">
        <div>
            @isset($prev['page'])
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.MakerNetwork', $prev) }}">&lt;&lt; Prev</a>
                </div>
            @endif
        </div>
        <div>
            @isset($next['page'])
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.MakerNetwork', $next) }}">Next &gt;&gt;</a>
                </div>
            @endif
        </div>
    </div>

    @include('footer')
@endsection

@extends('layout')

@section('content')
    <div class="node-list">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">Platform Network</h1>
        </div>

        <div class="node-map">
            @foreach ($platforms as $platform)
                <div>
                    <div class="link-node link-node-center" data-sub="{{ $platform->sub_net }}">
                        <a href="{{ route('Game.PlatformDetailNetwork', ['platformKey' => $platform->key]) }}">{!! $platform->node_name !!}</a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>



    <div class="node-list node-around" style="margin-top:100px;margin-bottom: 50px;">
        <div>
            @isset($prev['page'])
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.PlatformNetwork', $prev) }}">&lt;&lt; Prev</a>
                </div>
            @endif
        </div>
        <div>
            @isset($next['page'])
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.PlatformNetwork', $next) }}">Next &gt;&gt;</a>
                </div>
            @endif
        </div>
    </div>

    @include('footer')
@endsection

@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">Franchise Network</h1>
        </div>

        <div class="node-map">
        @foreach ($franchises as $franchise)
            <div>
                <div class="link-node link-node-center" data-sub="{{ $franchise->sub_net }}">
                    <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $franchise->key]) }}">{!! $franchise->node_name !!}</a>
                </div>
            </div>
        @endforeach
        </div>
    </div>

    <div class="node-list node-around" style="margin-top:100px;margin-bottom: 50px;">
        <div>
            @isset($prev['page'])
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.FranchiseNetwork', $prev) }}">&lt;&lt; Prev</a>
                </div>
            @endif
        </div>
        <div>
            @isset($next['page'])
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.FranchiseNetwork', $next) }}">Next &gt;&gt;</a>
                </div>
            @endif
        </div>
    </div>

    @include('footer')
@endsection

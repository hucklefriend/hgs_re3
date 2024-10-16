@extends('layout')

@section('title', 'Maker Network | ホラーゲームネットワーク')

@section('content')
    <div class="node h1">
        <h1 class="head1 fade">Maker Network</h1>
    </div>

    <div class="node-map">
        @foreach ($makers as $maker)
            <div>
                <div class="link-node link-node-center fade" data-sub="{{ $maker->sub_net }}" id="{{ $maker->key }}">
                    <a href="{{ route('Game.MakerDetailNetwork', ['makerKey' => $maker->key]) }}">
                        {!! $maker->node_name !!}
                    </a>
                </div>
            </div>

            @foreach ($maker->relatedChildren as $childMaker)
                <div>
                    <div class="link-node link-node-center fade" data-sub="s" id="{{ $childMaker->key }}" data-connect="{{ json_encode([$childMaker->relatedMaker->key]) }}">
                        <a href="{{ route('Game.MakerDetailNetwork', ['makerKey' => $childMaker->key]) }}">
                            {!! $childMaker->node_name !!}
                        </a>
                    </div>
                </div>
            @endforeach
        @endforeach
    </div>

    @include('common.paging', ['pager' => $makers])

    @include('footer')

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Maker') }}">管理</a>
        </div>
    @endif
@endsection

@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1 fade">Franchise Network</h1>
        </div>

        <div class="node-map">
        @foreach ($franchises as $franchise)
            <div>
                <div class="link-node link-node-center fade" data-sub="{{ $franchise->sub_net }}">
                    <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $franchise->key]) }}">{!! $franchise->node_name !!}</a>
                </div>
            </div>
        @endforeach
        </div>
    </div>

    @include('common.paging', ['pager' => $franchises])

    @include('footer')
@endsection

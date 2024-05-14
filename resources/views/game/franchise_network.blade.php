@extends('layout')

@section('title', 'FranchiseNetwork.hgn')

@section('content')
    <div class="node-list" style="margin-bottom: 100px;">
        <div style="text-align:center; margin: 20px 0;">
            <h1 class="head1">Franchise Network</h1>
        </div>

        <div class="node-lineup">
        @foreach ($franchises as $franchise)
            <div>
                <div class="link-node link-node-center">
                    <a href="{{ route('Game.FranchiseDetailNetwork', $franchise) }}">{!! $franchise->node_name !!}</a>
                </div>
            </div>
        @endforeach
        </div>
    </div>

    @include('footer')
@endsection

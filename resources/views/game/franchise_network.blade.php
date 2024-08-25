@extends('layout')

@section('title', 'Franchise Network | ホラーゲームネットワーク')

@section('content')
    <section style="margin-bottom: 40px !important;">
        <div class="node">
            <h1 class="head1 fade">Franchise Network</h1>
        </div>
    </section>

    <section>
        <div class="paginator" style="margin-bottom: 40px;">
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'a']) }}">あ</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'k']) }}">か</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 's']) }}">さ</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 't']) }}">た</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'n']) }}">な</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'h']) }}">は</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'm']) }}">ま</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'y']) }}">や</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'r']) }}">らわ</a>
            </div>
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

        <div class="paginator" style="margin-top: 40px;">
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'a']) }}">あ</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'k']) }}">か</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 's']) }}">さ</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 't']) }}">た</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'n']) }}">な</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'h']) }}">は</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'm']) }}">ま</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'y']) }}">や</a>
            </div>
            <div class="link-node link-node-center small fade">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'r']) }}">らわ</a>
            </div>
        </div>
    </section>

    @include('footer')
@endsection

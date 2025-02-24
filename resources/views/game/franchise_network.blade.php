@extends('layout')

@section('title', 'Franchise Network | ホラーゲームネットワーク')

@section('content')
    <section style="margin-bottom: 40px !important;">
        <div class="node">
            <h1 class="head1 fade" id="h1_title">Franchise Network</h1>
        </div>
    </section>

    <section>
        <div class="paginator" style="margin-bottom: 40px;">
            <div class="link-node link-node-center small fade" id="ln_a">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'a']) }}">あ</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_k">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'k']) }}">か</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_s">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 's']) }}">さ</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_t">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 't']) }}">た</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_n">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'n']) }}">な</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_h">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'h']) }}">は</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_m">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'm']) }}">ま</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_y">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'y']) }}">や</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_r">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'r']) }}">らわ</a>
            </div>
        </div>

        <div class="node-map">
        @foreach ($franchises as $franchise)
            <div>
                <div class="link-node link-node-center fade" data-sub="{{ $franchise->sub_net }}" id="ln_{{ $franchise->key }}">
                    <a href="{{ route('Game.FranchiseDetailNetwork', ['franchiseKey' => $franchise->key]) }}">{!! $franchise->node_name !!}</a>
                </div>
            </div>
        @endforeach
        </div>

        <div class="paginator" style="margin-top: 40px;">
            <div class="link-node link-node-center small fade" id="ln_a2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'a']) }}">あ</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_k2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'k']) }}">か</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_s2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 's']) }}">さ</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_t2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 't']) }}">た</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_n2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'n']) }}">な</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_h2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'h']) }}">は</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_m2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'm']) }}">ま</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_y2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'y']) }}">や</a>
            </div>
            <div class="link-node link-node-center small fade" id="ln_r2">
                <a href="{{ route('Game.FranchiseNetwork', ['prefix' => 'r']) }}">らわ</a>
            </div>
        </div>
    </section>

    @include('footer')

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Franchise') }}">管理</a>
        </div>
    @endif
@endsection

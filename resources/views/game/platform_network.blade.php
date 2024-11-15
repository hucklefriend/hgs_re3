@extends('layout')

@section('title', 'Platform Network | ホラーゲームネットワーク')

@section('content')
    <div class="node h1">
        <h1 class="head1 fade">Platform Network</h1>
    </div>

    <div class="node-map">
        @foreach ($platforms as $platform)
            <div>
                <div class="link-node link-node-center fade" data-sub="{{ $platform->sub_net }}">
                    <a href="{{ route('Game.PlatformDetailNetwork', ['platformKey' => $platform->key]) }}">{!! $platform->node_name !!}</a>
                </div>
            </div>
        @endforeach
    </div>

    @include('common.paging', ['pager' => $platforms])

    @include('footer')

    @if (\Illuminate\Support\Facades\Auth::guard('admin')->check())
        <div class="admin-edit">
            <a href="{{ route('Admin.Game.Platform') }}">管理</a>
        </div>
    @endif
@endsection

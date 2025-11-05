@extends('layout')

@section('title', 'マイページ')
@section('current-node-title', 'マイページ')

@section('nodes')
    <section class="node" id="mypage-welcome-node">
        <div class="node-head">
            <h2 class="node-head-text">ようこそ</h2>
            <span class="node-pt">●</span>
        </div>
        <div class="node-content basic">
            <p>{{ $user->name }}さんようこそ</p>
        </div>
    </section>

    @include('common.shortcut')
@endsection


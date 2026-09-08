@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', 'フォロワーリスト')
@section('current-node-title', 'フォロワーリスト')

@section('current-node-content')
    @if ($followers->isEmpty())
        <p>フォロワーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @include('user.my_node.relationship-list', ['users' => $followers, 'listKind' => 'followers', 'muteRoute' => 'User.MyNode.Following.Mute'])
@endsection

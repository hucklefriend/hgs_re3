@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', 'フォロー中')
@section('current-node-title', 'フォロー中')

@section('current-node-content')
    @if ($following->isEmpty())
        <p>フォロー中ユーザーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @include('user.my_node.relationship-list', ['users' => $following, 'listKind' => 'following', 'muteRoute' => 'User.MyNode.Following.Mute'])
@endsection

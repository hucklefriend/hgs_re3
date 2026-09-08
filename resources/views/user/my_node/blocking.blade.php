@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', 'ブロック中')
@section('current-node-title', 'ブロック中')

@section('current-node-content')
    @if ($blocking->isEmpty())
        <p>ブロックしているユーザーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @include('user.my_node.relationship-list', ['users' => $blocking, 'listKind' => 'blocking', 'muteRoute' => 'User.MyNode.Following.Mute'])
@endsection

@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', 'ミュート中')
@section('current-node-title', 'ミュート中')

@section('current-node-content')
    @if ($muting->isEmpty())
        <p>ミュートしているユーザーはいないようだ。</p>
    @endif
@endsection

@section('nodes')
    @include('user.my_node.relationship-list', ['users' => $muting, 'listKind' => 'muting', 'muteRoute' => 'User.MyNode.Muting.Mute'])
@endsection

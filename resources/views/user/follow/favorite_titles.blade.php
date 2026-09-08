@php
    $breadcrumbItems = [
        ['label' => 'MY NODE', 'url' => route('User.MyNode.Top')],
    ];
@endphp

@extends('layout')

@section('title', 'お気に入りタイトル')
@section('current-node-title', 'お気に入りタイトル')

@if ($favoriteTitles->isEmpty())
    @section('current-node-content')
    <p>お気に入りに登録されているタイトルはありません。</p>
    @endsection
@endif

@section('nodes')
    @if ($favoriteTitles->isNotEmpty())
        <section class="lineup-franchise favorite-title-catalog" id="favorite-titles-tree-node">
            <header>
                <div><p>LINEUP NODE</p><h2>お気に入りタイトル</h2></div>
            </header>
            <div class="lineup-franchise__entries">
                @foreach ($favoriteTitles as $title)
                    <a href="{{ route('Game.TitleDetail', ['titleKey' => $title->key]) }}" id="favorite-title-{{ $title->id }}-link-node"><span class="lineup-result-signal" aria-hidden="true"></span><b>{{ $title->name }}</b></a>
                @endforeach
            </div>
        </section>
    @endif

@endsection

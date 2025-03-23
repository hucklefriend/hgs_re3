@extends('layout')

@section('title', 'ホラーゲームネットワーク')

@section('map-sub')
<div class="map-header" id="horror-game-search-header">
    <div class="header-content">
        <form id="search-form" method="GET" action="{{ route('Api.Game.SearchHorrorGame') }}">
            <div class="search-container">
                <i class="bi bi-search search-icon"></i>
                <input type="text" id="search-input" placeholder="Search">
            </div>
        </form>
        <button class="menu-button" id="menu-toggle">
            <i class="bi bi-list"></i>
        </button>
    </div>
    <div class="menu-overlay" id="menu-overlay">
        <div class="menu-content">
            <a href="#" class="menu-item">
                <i class="bi bi-box-arrow-in-right"></i>
                ログイン
            </a>
            <a href="{{ route('Entrance') }}" class="menu-item">
                <i class="bi bi-house-door"></i>
                エントランスに戻る
            </a>
        </div>
    </div>
</div>
@endsection

@section('popup')
@endsection
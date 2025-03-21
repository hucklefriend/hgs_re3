@extends('layout')

@section('title', 'ホラーゲームネットワーク')

@section('map-sub')
<div class="map-header">
    <form id="search-form" method="GET" action="{{ route('Api.Game.SearchHorrorGame') }}">
        <div class="search-container">
            <i class="bi bi-search search-icon"></i>
            <input type="text" id="search-input" placeholder="Search">
        </div>
    </form>
</div>

<script>
    window.addEventListener('load', function() {
        window.hgn.createComponent('horror-game-search', 'hgs');
    });
</script>
@endsection

@section('popup')
@endsection
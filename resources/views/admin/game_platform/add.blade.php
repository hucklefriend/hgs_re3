@extends('layouts.management')

@section('title', 'プラットフォーム登録')

@section('content')
    <ol class="breadcrumb float-xl-end">
        <li class="breadcrumb-item"><a href="{{ route('管理') }}">管理</a></li>
        <li class="breadcrumb-item">マスター</li>
        <li class="breadcrumb-item"><a href="{{ route('管理-マスター-プラットフォーム') }}">プラットフォーム</a></li>
        <li class="breadcrumb-item active">登録</li>
    </ol>
    <h1 class="page-header">プラットフォーム登録</h1>
    <div class="panel panel-inverse">
        <form method="POST" action="{{ route('管理-マスター-プラットフォーム登録処理') }}">
            {{ csrf_field() }}
            <div class="panel-heading">
                <h4 class="panel-title">新規登録</h4>
            </div>
            <div class="panel-body">
                @include('management.master.platform.form')
            </div>
            <div class="panel-footer text-end">
                <button type="submit" class="btn btn-default">登録</button>
            </div>
        </form>
    </div>
@endsection

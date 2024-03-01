@extends('layouts.management')

@section('title', 'メーカー詳細')

@section('content')
    <ol class="breadcrumb float-xl-end">
        <li class="breadcrumb-item"><a href="{{ route('管理') }}">管理</a></li>
        <li class="breadcrumb-item">マスター</li>
        <li class="breadcrumb-item"><a href="{{ route('管理-マスター-メーカー') . session('search_maker') }}">メーカー</a></li>
        <li class="breadcrumb-item active">詳細</li>
    </ol>
    <h1 class="page-header">メーカー詳細</h1>
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('管理-マスター-メーカー編集', $model) }}" class="btn btn-default"><i class="fas fa-edit"></i></a>
            </div>
            <style>
                #maker-table th {
                    width: 150px;
                }
            </style>
            <table class="table" id="maker-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>名称</th>
                    <td>{{ $model->name }}</td>
                </tr>
                <tr>
                    <th>略称</th>
                    <td>{{ $model->acronym }}</td>
                </tr>
                <tr>
                    <th>よみがな</th>
                    <td>{{ $model->phonetic }}</td>
                </tr>
                <tr>
                    <th>属性</th>
                    <td>{{ \Hgs3\Enums\Game\Maker\Kind::from($model->kind)->text() }}</td>
                </tr>
                <tr>
                    <th>公式サイト</th>
                    <td>@empty($maker->url)-@else <a href="{{ $model->url }}" target="_blank">{{ $model->url }}</a> @endempty</td>
                </tr>
                <tr>
                    <th>公式サイトのR指定</th>
                    <td>{{ \Hgs3\Enums\RatedR::from($model->url_rate_r)->text() }}</td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('管理-マスター-メーカー削除', $model) }}" onsubmit="return confirm('削除します');">
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i></button>
                </form>
            </div>
        </div>
    </div>
@endsection

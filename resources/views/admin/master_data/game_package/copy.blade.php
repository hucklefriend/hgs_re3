@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        @foreach ($errors->all() as $error)
            <li>{{$error}}</li>
        @endforeach
        <form method="POST" action="{{ route('管理-マスター-パッケージ複製処理', $model) }}">
            {{ csrf_field() }}

            <div class="panel-body">
                @include('management.master.package.form')
            </div>
            <div class="panel-footer text-end">
                <button type="submit" class="btn btn-default">複製</button>
            </div>
        </form>
    </div>
@endsection

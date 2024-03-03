@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <form method="POST" action="{{ route('Admin.MasterData.Platform.Store') }}">
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

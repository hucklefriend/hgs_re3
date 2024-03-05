@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">更新</h4>
        </div>
        <form method="POST" action="{{ route('管理-マスター-パッケージショップ更新処理', ['package' => $package, 'shop' => $model]) }}">
            {{ method_field('PUT') }}
            {{ csrf_field() }}

            <div class="panel-body">
                @include('management.master.package.shop_form')
            </div>
            <div class="panel-footer text-end">
                <button type="submit" class="btn btn-default">更新</button>
            </div>
        </form>
    </div>
@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.Game.PackageGroup.Edit', $model) }}" class="btn btn-default">
                    <i class="fas fa-edit"></i><span class="d-none d-md-inline"> Edit</span>
                </a>
            </div>
            <table class="table admin-detail-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>名称</th>
                    <td>{{ $model->name }}</td>
                </tr>
                <tr>
                    <th>ノード表示用名称</th>
                    <td>
                        <div class="d-inline-block text-center">
                            {!! $model->node_name !!}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>表示順</th>
                    <td>{{ $model->sort_order }}</td>
                </tr>
                <tr>
                    <th>説明</th>
                    <td>
                        @include('common.description', ['model' => $model])
                    </td>
                </tr>
                <tr>
                    <th>タイトル</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->titles as $title)
                                <li class="list-group-item p-2"><a href="{{ route('Admin.Game.Title.Detail', $title) }}">{{ $title->name }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.PackageGroup.LinkTitle', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>パッケージ</th>
                    <td>
                        <ul class="list-group">
                        @foreach ($model->packages as $pkg)
                            <li class="list-group-item p-2"><a href="{{ route('Admin.Game.Package.Detail', $pkg) }}">
                                【{{ $pkg->platform->acronym }}】{{ $pkg->name }}</a>
                            </li>
                        @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.Package.Add') }}?package_group_id={{ $model->id }}" class="btn btn-default">
                            <i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span>
                        </a>
                        <a href="{{ route('Admin.Game.PackageGroup.LinkPackage', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.Game.PackageGroup.Delete', $model) }}" onsubmit="return confirm('削除します');">
                    @csrf
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit">
                        <i class="fas fa-eraser"></i><span class="d-none d-md-inline"> Delete</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
@endsection

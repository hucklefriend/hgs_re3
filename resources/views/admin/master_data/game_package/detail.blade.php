@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Package.Copy', $model) }}" class="btn btn-default"><i class="far fa-copy"></i> Copy</a>&nbsp;
                <a href="{{ route('Admin.MasterData.Package.Edit', $model) }}" class="btn btn-default"><i class="fas fa-edit"></i> Edit</a>
            </div>
            <table class="table admin-form-table">
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
                    <th>メーカー</th>
                    <td>{{ $model->maker->name ?? '' }}</td>
                </tr>
                <tr>
                    <th>プラットフォーム</th>
                    <td>{{ $model->platform->name ?? '' }}</td>
                </tr>
                <tr>
                    <th>発売日</th>
                    <td>{{ $model->release_at }}</td>
                </tr>
                <tr>
                    <th>タイトル</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->titles as $title)
                                <li class="list-group-item"><a href="{{ route('Admin.MasterData.Title.Detail', $title) }}">{{ $title->name ?? '' }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.MasterData.Package.LinkTitle', $model) }}" class="btn btn-sm btn-default"><i class="fas fa-link"></i> Link</a>
                    </td>
                </tr>
                <tr>
                    <th>ショップ</th>
                    <td>
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.MasterData.Package.Delete', $model) }}" onsubmit="return confirm('削除します');">
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> Delete</button>
                </form>
            </div>
        </div>
    </div>
@endsection

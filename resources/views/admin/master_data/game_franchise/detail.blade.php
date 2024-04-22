@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Franchise.Edit', $model) }}" class="btn btn-default"><i class="fas fa-edit"></i> Edit</a>
            </div>
            <table class="table admin-form-table" id="franchise-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>名称</th>
                    <td>{{ $model->name }}</td>
                </tr>
                <tr>
                    <th>よみがな</th>
                    <td>{{ $model->phonetic }}</td>
                </tr>
                <tr>
                    <th>ノード表示用名称</th>
                    <td>{!! $model->node_title !!}</td>
                </tr>
                <tr>
                    <th>シリーズ</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->series as $series)
                                <li class="list-group-item"><a href="{{ route('Admin.MasterData.Series.Detail', $series) }}">{{ $series->name }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.MasterData.Franchise.LinkSeries', $model) }}" class="btn btn-default"><i class="fas fa-link"></i> Link</a>
                    </td>
                </tr>
                <tr>
                    <th>タイトル</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->titles as $title)
                                <li class="list-group-item"><a href="{{ route('Admin.MasterData.Title.Detail', $title) }}">{{ $title->name }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.MasterData.Franchise.LinkTitle', $model) }}" class="btn btn-default"><i class="fas fa-link"></i> Link</a>
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.MasterData.Franchise.Delete', $model) }}" onsubmit="return confirm('削除します');">
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> Delete</button>
                </form>
            </div>
        </div>
    </div>
@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Series.Edit', $model) }}" class="btn btn-default"><i class="fas fa-edit"></i> Edit</a>
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
                    <th>よみがな</th>
                    <td>{{ $model->phonetic }}</td>
                </tr>
                <tr>
                    <th>ノード表示用</th>
                    <td>
                        <div class="d-inline-block text-center">
                            {!! $model->node_title !!}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>フランチャイズ</th>
                    <td>
                        @if ($model->franchise())
                            <span class="mr-2"><a href="{{ route('Admin.MasterData.Franchise.Detail', $model->franchise()) }}">{{ $model->franchise()->name }}</a></span>
                        @endif
                        <a href="{{ route('Admin.MasterData.Series.LinkFranchise', $model) }}" class="btn btn-default"><i class="fas fa-link"></i> Link</a>
                    </td>
                </tr>
                <tr>
                    <th>タイトル</th>
                    <td>
                        <ul class="list-group">
                        @foreach ($model->titles as $title)
                            <li class="list-group-item p-2"><a href="{{ route('Admin.MasterData.Title.Detail', $title) }}">{{ $title->name }}</a></li>
                        @endforeach
                        </ul>
                        <a href="{{ route('Admin.MasterData.Series.LinkTitle', $model) }}" class="btn btn-default"><i class="fas fa-link"></i> Link</a>
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.MasterData.Series.Delete', $model) }}" onsubmit="return confirm('削除します');">
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> Delete</button>
                </form>
            </div>
        </div>
    </div>
@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.Game.Series.Edit', $model) }}" class="btn btn-default">
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
                    <th>よみがな</th>
                    <td>{{ $model->phonetic }}</td>
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
                    <th>シリーズ最初のリリース日(数値)</th>
                    <td>
                        <div class="d-inline-block text-center">
                            {!! $model->first_release_int !!}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>説明</th>
                    <td>
                        @include('common.description', ['model' => $model])
                    </td>
                </tr>
                <tr>
                    <th>フランチャイズ</th>
                    <td>
                        @if ($model->franchise !== null)
                            <a href="{{ route('Admin.Game.Franchise.Detail', $model->franchise) }}">{{ $model->franchise->name }}</a>
                        @else
                            --
                        @endif
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
                        <a href="{{ route('Admin.Game.Series.LinkTitle', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>Tree</th>
                    <td>
                        @foreach ($tree as $node)
                            <x-admin.tree :node="$node" />
                        @endforeach
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.Game.Series.Delete', $model) }}" onsubmit="return confirm('削除します');">
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

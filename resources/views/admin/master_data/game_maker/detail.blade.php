@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Maker.Edit', $model) }}" class="btn btn-default"><i class="fas fa-edit"></i> Edit</a>
            </div>
            <table class="table admin-detail-table" id="maker-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>key</th>
                    <td>{{ $model->key }}</td>
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
                    <th>ノード表示用名称</th>
                    <td>
                        <div class="d-inline-block text-center">
                            {!! $model->node_name !!}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>H1ノード表示用名称</th>
                    <td>
                        <div class="d-inline-block text-center">
                            {!! $model->h1_node_name !!}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>関連メーカー(親)</th>
                    <td>{{ $model->relatedMaker?->name ?? '' }}</td>
                </tr>
                <tr>
                    <th>関連メーカー(子)</th>
                    <td>
                        @if ($model->related_children()->count() > 0)
                            <ul>
                                @foreach ($model->relatedChildren as $child)
                                    <li>{{ $child->name }}</li>
                                @endforeach
                            </ul>
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>俗称</th>
                    <td>{!! nl2br(e($model->synonymsStr)); !!}</td>
                </tr>
                <tr>
                    <th>説明</th>
                    <td>
                        @include('common.description', ['model' => $model])
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.MasterData.Maker.Delete', $model) }}" onsubmit="return confirm('削除します');">
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> Delete</button>
                </form>
            </div>
        </div>
    </div>
@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.Game.Franchise.Edit', $model) }}" class="btn btn-default">
                    <i class="fas fa-edit"></i><span class="d-none d-md-inline"> Edit</span>
                </a>
            </div>
            <table class="table admin-detail-table" id="franchise-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>key</th>
                    <td><a href="{{ route('Game.FranchiseDetail', ['franchiseKey' => $model->key]) }}">{{ $model->key }}</a></td>
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
                    <th>H1ノード表示用名称</th>
                    <td>
                        <div class="d-inline-block text-center">
                            {!! $model->h1_node_name !!}
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
                    <th>シリーズ</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->series as $series)
                                <li class="list-group-item"><a href="{{ route('Admin.Game.Series.Detail', $series) }}">{{ $series->name }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.Franchise.LinkSeries', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>タイトル</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->titles as $title)
                                <li class="list-group-item"><a href="{{ route('Admin.Game.Title.Detail', $title) }}">{{ $title->name }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.Franchise.LinkTitle', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>メディアミックスグループ</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->mediaMixGroups as $mmg)
                                <li class="list-group-item"><a href="{{ route('Admin.Game.MediaMixGroup.Detail', $mmg) }}">{{ $mmg->name }}</a></li>
                            @endforeach
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>メディアミックス</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->mediaMixes as $mm)
                                <li class="list-group-item"><a href="{{ route('Admin.Game.MediaMix.Detail', $mm) }}">{{ $mm->name }}</a></li>
                            @endforeach
                        </ul>
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
            <div class="d-flex justify-content-between">
                <div>
                    @if ($model->prev())
                        <a href="{{ route('Admin.Game.Franchise.Detail', $model->prev()) }}" class="btn btn-default"><i class="fas fa-caret-left"></i></a>
                    @endif
                    @if ($model->next())
                        <a href="{{ route('Admin.Game.Franchise.Detail', $model->next()) }}" class="btn btn-default"><i class="fas fa-caret-right"></i></a>
                    @endif
                </div>
                <div class="text-end">
                    <form method="POST" action="{{ route('Admin.Game.Franchise.Delete', $model) }}" onsubmit="return confirm('削除します');">
                        @csrf
                        {{ method_field('DELETE') }}
                        <button class="btn btn-danger" type="submit">
                            <i class="fas fa-eraser"></i><span class="d-none d-md-inline"> Delete</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('js')



@endsection

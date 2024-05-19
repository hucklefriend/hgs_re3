@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Title.Edit', $model) }}" class="btn btn-default"><i class="fas fa-edit"></i> Edit</a>
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
                    <th>俗称</th>
                    <td>{!! nl2br(e($model->synonymsStr)); !!}</td>
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
                    <th>ジャンル</th>
                    <td>{{ $model->genre }}</td>
                </tr>
                <tr>
                    <th>原点パッケージ</th>
                    <td>{{ $model->originalPackage->name ?? '-' }}</td>
                </tr>
                <tr>
                    <th>あらすじ</th>
                    <td>{!! nl2br(e($model->introduction)) !!}</td>
                </tr>
                <tr>
                    <th>あらすじ引用元</th>
                    <td>{!! $model->introduction_from !!}</td>
                </tr>
                <tr>
                    <th>シリーズ</th>
                    <td>
                        @if ($model->series())
                            <span class="mr-2">
                                <a href="{{ route('Admin.MasterData.Series.Detail', $model->series()) }}">
                                    {{ $model->series()->name }}
                                </a>
                            </span>
                        @endif
                        <a href="{{ route('Admin.MasterData.Title.LinkSeries', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i> Link
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>フランチャイズ</th>
                    <td>
                        @if ($model->franchise())
                            <span class="mr-2">
                                <a href="{{ route('Admin.MasterData.Franchise.Detail', $model->franchise()) }}">
                                    {{ $model->franchise()->name }}
                                </a>
                            </span>
                        @endif
                        @if (!$model->series())
                        <a href="{{ route('Admin.MasterData.Title.LinkFranchise', $model) }}" class="btn btn-default"><i class="fas fa-link"></i> Link</a>
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>パッケージ</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->packages as $package)
                                <li class="list-group-item"><a href="{{ route('Admin.MasterData.Package.Detail', $package) }}">{{ $package->getNameWithPlatform() }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.MasterData.Title.LinkPackage', $model) }}" class="btn btn-default"><i class="fas fa-link"></i> Link</a>
                    </td>
                </tr>
            </table>
        </div>

        <div class="panel-footer">
            <div class="d-flex justify-content-between">
                <div>
                    @if ($model->prev())
                        <a href="{{ route('Admin.MasterData.Title.Detail', $model->prev()) }}" class="btn btn-default"><i class="fas fa-caret-left"></i></a>
                    @endif
                    @if ($model->next())
                        <a href="{{ route('Admin.MasterData.Title.Detail', $model->next()) }}" class="btn btn-default"><i class="fas fa-caret-right"></i></a>
                    @endif
                </div>
                <div class="text-end">
                    @if ($model->packages()->count() === 0)
                        <form method="POST" action="{{ route('Admin.MasterData.Title.Delete', $model) }}" onsubmit="return confirm('削除します');">
                            {{ csrf_field() }}
                            {{ method_field('DELETE') }}
                            <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> Delete</button>
                        </form>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection

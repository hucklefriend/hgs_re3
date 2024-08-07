@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.Game.MediaMix.Edit', $model) }}" class="btn btn-default">
                    <i class="fas fa-edit"></i><span class="d-none d-md-inline"> Edit</span>
                </a>
            </div>
            <table class="table admin-detail-table">
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
                    <th>フランチャイズ</th>
                    <td>{{ $model->franchise->name ?? '--' }}</td>
                </tr>
                <tr>
                    <th>メディアミックスグループ</th>
                    <td>{{ $model->mediaMixGroup->name ?? '--' }}</td>
                </tr>
                <tr>
                    <th>レーティング</th>
                    <td>{{ $model->rating->text() }}</td>
                </tr>
                <tr>
                    <th>説明</th>
                    <td>
                        @include('common.description', ['model' => $model])
                    </td>
                </tr>
                <tr>
                    <th>関連商品</th>
                    <td>
                        <ul class="list-group">
                        @foreach ($model->relatedProducts as $rp)
                            <li class="list-group-item p-2"><a href="{{ route('Admin.Game.RelatedProduct.Detail', $rp) }}">{{ $rp->name }}</a></li>
                        @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.MediaMix.LinkRelatedProduct', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.Game.MediaMix.Delete', $model) }}" onsubmit="return confirm('削除します');">
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

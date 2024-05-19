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
                    <th>ノード表示用名称</th>
                    <td>
                        <div class="d-inline-block text-center">
                            {!! $model->node_name !!}
                        </div>
                    </td>
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
                    <th>レーティング</th>
                    <td>{{ $model->rating->text() }}</td>
                </tr>
                <tr>
                    <th>発売日</th>
                    <td>{{ $model->release_at }}</td>
                </tr>
                <tr>
                    <th>画像(小)</th>
                    <td>
                        @if ($model->img_s_url)
                            <img src="{{ $model->img_s_url }}">
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>画像(中)</th>
                    <td>
                        @if ($model->img_m_url)
                            <img src="{{ $model->img_m_url }}">
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>説明</th>
                    <td>
                        @include('common.explain', ['model' => $model])
                    </td>
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
                        <table>
                            @foreach ($model->shops as $shop)
                            <tr>
                                <td><a href="{{ $shop->url }}" target="_blank">{{ $shop->shop()->name }}</a></td>
                                <td>
                                    <a href="{{ route('Admin.MasterData.Package.EditShop', ['package' => $model, 'shop_id' => $shop->shop_id]) }}" class="btn btn-default btn-sm" style="margin-left:2rem;"><i class="fas fa-edit"></i> Edit</a>
                                </td>
                                <td>
                                    <form method="post" action="{{ route('Admin.MasterData.Package.DeleteShop', ['package' => $model, 'shop_id' => $shop->shop_id]) }}" style="margin-left:1rem;" onsubmit="return confirm('{{ $shop->shop()->name }}を削除します。');">
                                        {{ csrf_field() }}
                                        {{ method_field('DELETE') }}
                                        <button type="submit" class="btn btn-danger btn-sm"><i class="fas fa-eraser"></i> Delete</button>
                                    </form>
                                </td>
                            </tr>
                            @endforeach
                        </table>
                        <a href="{{ route('Admin.MasterData.Package.AddShop', $model) }}" class="btn btn-sm btn-default"><i class="fas fa-plus"></i> Add</a>
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

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.RelatedProduct.Edit', $model) }}" class="btn btn-default">
                    <i class="fas fa-edit"></i><span class="d-none d-md-inline"> Edit</span>
                </a>
            </div>
            <table class="table admin-form-table">
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
                    <th>小画像</th>
                    <td>
                        @if (!empty($model->img_s_url))
                            <img src="{{ conv_asset_url($model->img_s_url) }}">
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>中画像</th>
                    <td>
                        @if (!empty($model->img_m_url))
                            <img src="{{ conv_asset_url($model->img_m_url) }}">
                        @endif
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
                        <a href="{{ route('Admin.MasterData.RelatedProduct.LinkTitle', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>メディアミックス</th>
                    <td>
                        @foreach ($model->mediaMixes as $mm)
                            <span class="mr-2"><a href="{{ route('Admin.MasterData.MediaMix.Detail', $mm) }}">{{ $mm->name }}</a></span>
                        @endforeach
                        <a href="{{ route('Admin.MasterData.RelatedProduct.LinkMediaMix', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
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
                                        <a href="{{ route('Admin.MasterData.RelatedProduct.EditShop', ['package' => $model, 'shop_id' => $shop->shop_id]) }}" class="btn btn-default btn-sm" style="margin-left:2rem;"><i class="fas fa-edit"></i> Edit</a>
                                    </td>
                                    <td>
                                        <form method="post" action="{{ route('Admin.MasterData.RelatedProduct.DeleteShop', ['relatedProduct' => $model, 'shop_id' => $shop->shop_id]) }}" style="margin-left:1rem;" onsubmit="return confirm('{{ $shop->shop()->name }}を削除します。');">
                                            @csrf
                                            {{ method_field('DELETE') }}
                                            <button type="submit" class="btn btn-danger btn-sm">
                                                <i class="fas fa-eraser"></i><span class="d-none d-md-inline"> Delete</span>
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </table>
                        <a href="{{ route('Admin.MasterData.RelatedProduct.AddShop', $model) }}" class="btn btn-sm btn-default">
                            <i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span>
                        </a>
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('Admin.MasterData.RelatedProduct.Delete', $model) }}" onsubmit="return confirm('削除します');">
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

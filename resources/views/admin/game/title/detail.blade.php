@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.Game.Title.Edit', $model) }}" class="btn btn-default">
                    <i class="fas fa-edit"></i><span class="d-none d-md-inline"> Edit</span>
                </a>
            </div>
            <table class="table admin-detail-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>フランチャイズ</th>
                    <td>
                        @if ($model->franchise)
                            <a href="{{ route('Admin.Game.Franchise.Detail', $model->franchise) }}">{{ $model->franchise->name }}</a>
                        @else
                            --
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>シリーズ</th>
                    <td>
                        @if ($model->series)
                            <a href="{{ route('Admin.Game.Series.Detail', $model->series) }}">{{ $model->series->name }}</a>
                            (
                            @if ($model->series->franchise)
                                <a href="{{ route('Admin.Game.Franchise.Detail', $model->series->franchise) }}">{{ $model->series->franchise->name }}フランチャイズ</a>
                            @else
                                フランチャイズ未設定
                            @endif
                            )
                        @else
                            --
                        @endif

                    </td>
                </tr>
                <tr>
                    <th>key</th>
                    <td><a href="{{ route('Game.TitleDetailNetwork', ['titleKey' => $model->key]) }}">{{ $model->key }}</a></td>
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
                    <th>OGP</th>
                    <td>
                        <x-admin.ogp :model="$model" />
                    </td>
                </tr>
                <tr>
                    <th>説明</th>
                    <td>
                        @include('common.description', ['model' => $model])
                    </td>
                </tr>
                <tr>
                    <th>OGPの説明を利用</th>
                    <td>
                        {{ $model->use_ogp_description ? '利用する' : '利用しない' }}
                    </td>
                </tr>
                <tr>
                    <th>初リリース日</th>
                    <td>
                        {{ $model->first_release_int }}
                    </td>
                </tr>
                <tr>
                    <th>パッケージグループ</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->packageGroups as $pkgGroup)
                                <li class="list-group-item"><a href="{{ route('Admin.Game.PackageGroup.Detail', $pkgGroup) }}">{{ $pkgGroup->name }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.PackageGroup.Add') }}?title_id={{ $model->id }}" class="btn btn-default">
                            <i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span>
                        </a>
                        <a href="{{ route('Admin.Game.Title.LinkPackageGroup', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                        @if (!$model->packageGroups->isEmpty())
                            <a href="{{ route('Admin.Game.Title.UpdatePackageGroupMulti', $model) }}" class="btn btn-default">
                                <i class="fas fa-table"></i><span class="d-none d-md-inline"> Edit Package Group</span>
                            </a>
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>パッケージ</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->packages as $package)
                                <li class="list-group-item"><a href="{{ route('Admin.Game.Package.Detail', $package) }}">{{ $package->getNameWithPlatform() }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.Package.Add') }}?title_id={{ $model->id }}" class="btn btn-default">
                            <i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span>
                        </a>
                        <a href="{{ route('Admin.Game.Title.LinkPackage', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                        @if (!$model->packages->isEmpty())
                            <a href="{{ route('Admin.Game.Title.UpdatePackageMulti', $model) }}" class="btn btn-default">
                                <i class="fas fa-table"></i><span class="d-none d-md-inline"> Edit Package</span>
                            </a>
                        @endif
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
                        <a href="{{ route('Admin.Game.RelatedProduct.Add') }}?title_id={{ $model->id }}" class="btn btn-default">
                            <i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span>
                        </a>
                        <a href="{{ route('Admin.Game.Title.LinkRelatedProduct', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <th>メディアミックス</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($model->mediaMixes as $mm)
                                <li class="list-group-item p-2"><a href="{{ route('Admin.Game.MediaMix.Detail', $mm) }}">{{ $mm->name }}</a></li>
                            @endforeach
                        </ul>
                        <a href="{{ route('Admin.Game.MediaMix.Add') }}?title_id={{ $model->id }}" class="btn btn-default">
                            <i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span>
                        </a>
                        <a href="{{ route('Admin.Game.Title.LinkMediaMix', $model) }}" class="btn btn-default">
                            <i class="fas fa-link"></i><span class="d-none d-md-inline"> Link</span>
                        </a>
                    </td>
                </tr>
            </table>
        </div>

        <div class="panel-footer">
            <div class="d-flex justify-content-between">
                <div>
                    @if ($model->prev())
                        <a href="{{ route('Admin.Game.Title.Detail', $model->prev()) }}" class="btn btn-default"><i class="fas fa-caret-left"></i></a>
                    @endif
                    @if ($model->next())
                        <a href="{{ route('Admin.Game.Title.Detail', $model->next()) }}" class="btn btn-default"><i class="fas fa-caret-right"></i></a>
                    @endif
                </div>
                <div class="text-end">
                    @if ($model->packages()->count() === 0)
                        <form method="POST" action="{{ route('Admin.Game.Title.Delete', $model) }}" onsubmit="return confirm('削除します');">
                            @csrf
                            {{ method_field('DELETE') }}
                            <button class="btn btn-danger" type="submit">
                                <i class="fas fa-eraser"></i><span class="d-none d-md-inline"> Delete</span>
                            </button>
                        </form>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection

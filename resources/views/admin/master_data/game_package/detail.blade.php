@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $package->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Package.Copy', $package) }}" class="btn btn-outline-info"><i class="far fa-copy"></i></a>&nbsp;
                <a href="{{ route('Admin.MasterData.Package.Edit', $package) }}" class="btn btn-default"><i class="fas fa-edit"></i></a>
            </div>
            <table class="table">
                <tr>
                    <th>ID</th>
                    <td>{{ $package->id }}</td>
                </tr>
                <tr>
                    <th>名称</th>
                    <td>{{ $package->name }}</td>
                </tr>
                <tr>
                    <th>略称</th>
                    <td>{{ $package->acronym }}</td>
                </tr>
                <tr>
                    <th>メーカー</th>
                    <td>{{ $package->maker->name }}</td>
                </tr>
                <tr>
                    <th>プラットフォーム</th>
                    <td>{{ $package->platform->name ?? '' }}</td>
                </tr>
                <tr>
                    <th>発売日</th>
                    <td>{{ $package->release_at }}</td>
                </tr>
                <tr>
                    <th>ソフト</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($package->softs as $soft)
                                <li class="list-group-item"><a href="{{ route('管理-マスター-ソフト詳細', $soft) }}">{{ $soft->name ?? '' }}</a></li>
                            @endforeach
                            <li class="list-group-item"><a href="{{ route('管理-マスター-パッケージソフト紐づけ', $package) }}" class="btn btn-sm btn-default"><i class="fas fa-plus"></i></a></li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>ショップ</th>
                    <td>
                        <ul class="list-group">
                            @foreach ($package->shops() as $shop)
                                <li class="list-group-item">
                                    <a href="{{ route('管理-マスター-パッケージショップ詳細', [$package, $shop]) }}">
                                        {{ \Hgs3\Enums\Game\Shop::tryFrom($shop->shop_id)->name() }}
                                    </a>
                                </li>
                            @endforeach
                            <li class="list-group-item"><a href="{{ route('管理-マスター-パッケージショップ追加', $package) }}" class="btn btn-sm btn-default"><i class="fas fa-plus"></i></a></li>
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="text-end">
                <form method="POST" action="{{ route('管理-マスター-パッケージ削除', $package) }}" onsubmit="return confirm('削除します');">
                    {{ csrf_field() }}
                    {{ method_field('DELETE') }}
                    <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> Delete</button>
                </form>
            </div>
        </div>
    </div>
@endsection

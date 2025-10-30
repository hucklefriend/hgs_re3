@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.Game.Package.EditShopMulti') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">ショップ</label>
                    <div class="col-md-9">
                        <x-admin.select-enum name="shop" :model="(object)['shop' => $shop]" :list="App\Enums\Shop::selectList()" />
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">名前</label>
                    <div class="col-md-9">
                        <input type="text" name="name" value="{{ $search['name'] }}" class="form-control" placeholder="名前" autocomplete="off">
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">プラットフォーム</label>
                    <div class="col-md-9">
                        <x-admin.select-game-platform-multi name="platform_ids[]" :selected="$search['platform_ids']" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-7 offset-md-3">
                        <button type="submit" class="btn btn-sm btn-primary w-100px me-5px">Search</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $shop->name() }} List</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            <div>{{ $packageShops->appends($search)->links() }}</div>
            <form method="POST" action="{{ route('Admin.Game.Package.UpdateShopMulti', $search) }}">
                @csrf
                {{ method_field('PUT') }}
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>名称</th>
                        <th>PLT</th>
                        <th>URL</th>
                        <th>param1</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($packageShops as $pkgShop)
                        <tr>
                            <td>{{ $pkgShop->id }}</td>
                            <td>
                                @if ($pkgShop->package)
                                    <a href="{{ route('Admin.Game.Package.Detail', $pkgShop->package) }}">{{ $pkgShop->package->name }}</a>
                                @endif
                            </td>
                            <td>{{ $pkgShop->package?->platform->acronym ?? '' }}</td>
                            <td><x-admin.multi-edit-input name="url" :model="$pkgShop" /></td>
                            <td>
                                @if ($shop === App\Enums\Shop::Amazon)
                                    <div class="input-group">
                                        <x-admin.multi-edit-input name="param1" :model="$pkgShop" />
                                        <a href="https://www.amazon.co.jp/dp/{{ $pkgShop->param1 }}" target="_blank" class="btn btn-default"><i class="fab fa-amazon"></i></a>
                                    </div>
                                @else
                                    <x-admin.multi-edit-input name="param1" :model="$pkgShop" />
                                @endif
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <div class="my-4 d-flex justify-content-end">
                    <a href="{{ route('Admin.Game.Package', $listSearch) }}" class="btn btn-default">Cancel</a>
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>

            <div>{{ $packageShops->appends($search)->links() }}</div>
        </div>
    </div>
@endsection

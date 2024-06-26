@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.MasterData.Package') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">名前</label>
                    <div class="col-md-9">
                        {{ html()->input('text', 'name', $search['name'])->class('form-control')->placeholder('名称など')->autocomplete('off') }}
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">プラットフォーム</label>
                    <div class="col-md-9">
                        <x-admin.select-game-platform-multi name="platform_ids[]" />
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
            <h4 class="panel-title">List</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            <div class="d-flex justify-content-between">
                <div>{{ $packages->appends($search)->links() }}</div>
                <div class="text-end">
                    <a href="{{ route('Admin.MasterData.Package.Add') }}" class="btn btn-default"><i class="fas fa-plus"></i> Add</a>
                    <a href="{{ route('Admin.MasterData.Package.EditMulti', $search) }}" class="btn btn-default"><i class="fas fa-pen"></i> Edit Multi</a>
                </div>
            </div>

            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>タイトル</th>
                    <th>略称</th>
                    <th>プラットフォーム</th>
                    <th>発売日</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($packages as $package)
                    <tr>
                        <td>{{ $package->id }}</td>
                        <td>{{ $package->name }}</td>
                        <td>{{ $package->acronym }}</td>
                        <td>{{ $package->platform->acronym ?? '' }}</td>
                        <td>{{ $package->release_at }}</td>
                        <td class="text-center"><a href="{{ route('Admin.MasterData.Package.Detail', $package) }}" class="btn btn-default"><i class="fas fa-info-circle"></i> Detail</a></td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            <div>{{ $packages->appends($search)->links() }}</div>
        </div>
    </div>
@endsection

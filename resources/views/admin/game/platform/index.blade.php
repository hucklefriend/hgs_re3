@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.Game.Platform') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Name</label>
                    <div class="col-md-9">
                        {{ html()->text('name', $search['name'])->class('form-control')->placeholder('名称など')->autocomplete('off') }}
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
        <div class="panel-body">
            <div class="d-flex justify-content-between">
                <div>{{ $platforms->appends($search)->links() }}</div>
                <div class="text-end">
                    <a href="{{ route('Admin.Game.Platform.Add') }}" class="btn btn-default">
                        <i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span>
                    </a>
                    <a href="{{ route('Admin.Game.Platform.EditMulti', $search) }}" class="btn btn-default">
                        <i class="fas fa-table"></i><i class="fas fa-pen"></i><span class="d-none d-md-inline"> Edit Multi</span>
                    </a>
                </div>
            </div>

            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>名前</th>
                    <th>略称</th>
                    <th>区分</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($platforms as $platform)
                    <tr>
                        <td>{{ $platform->id }}</td>
                        <td>{{ $platform->name }}</td>
                        <td>{{ $platform->acronym }}</td>
                        <td>{{ $platform->type?->text() ?? '' }}</td>
                        <td class="text-center">
                            <a href="{{ route('Admin.Game.Platform.Detail', $platform) }}" class="btn btn-default">
                                <i class="fas fa-info-circle"></i><span class="d-none d-md-inline"> Detail</span>
                            </a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div>{{ $platforms->appends($search)->links() }}</div>
        </div>
    </div>

@endsection

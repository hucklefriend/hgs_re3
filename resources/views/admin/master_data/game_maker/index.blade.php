@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.MasterData.Maker') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Name</label>
                    <div class="col-md-9">
                        {{ html()->text('name')->value($search['name'] ?? '')->class('form-control')->placeholder('名前 or よみがな or 略称(半角スペースで単語区切り)')->autocomplete('off') }}
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
                <div>{{ $makers->appends($search)->links() }}</div>
                <div class="text-end">
                    <a href="{{ route('Admin.MasterData.Maker.Add') }}" class="btn btn-default"><i class="fas fa-plus"></i><span class="d-none d-md-inline"> Add</span></a>
                    <a href="{{ route('Admin.MasterData.Maker.EditMulti', $search) }}" class="btn btn-default"><i class="fas fa-pen"></i><i class="fas fa-pen"></i><span class="d-none d-md-inline"> Edit Multi</span></a>
                </div>
            </div>

            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>名前</th>
                    <th>略称</th>
                    <th>ふりがな</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($makers as $maker)
                    <tr>
                        <td>{{ $maker->id }}</td>
                        <td>{{ $maker->name }}</td>
                        <td>{{ $maker->acronym }}</td>
                        <td>{{ $maker->phonetic }}</td>
                        <td class="text-center"><a href="{{ route('Admin.MasterData.Maker.Detail', $maker) }}" class="btn btn-default"><i class="fas fa-info-circle"></i><span class="d-none d-md-inline"> Detail</span></a></td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            <div>{{ $makers->appends($search)->links() }}</div>
        </div>
    </div>

@endsection

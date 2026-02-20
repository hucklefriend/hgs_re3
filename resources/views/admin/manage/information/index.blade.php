@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.Manage.Information') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Name</label>
                    <div class="col-md-9">
                        <input type="datetime-local" name="datetime" step="60" value="{{ $search['datetime'] }}" class="form-control w-auto">
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
            <div class="d-flex  justify-content-between">
                <div>{{ $information->appends($search)->links() }}</div>
                <div class="text-end">
                    <a href="{{ route('Admin.Manage.Information.Create') }}" class="btn btn-default"><i class="fas fa-plus"></i> Add</a>
                </div>
            </div>
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>掲題</th>
                    <th>掲載期間</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($information as $info)
                    <tr>
                        <td>{{ $info->id }}</td>
                        <td>{{ $info->head }}</td>
                        <td>{{ $info->open_at->format('Y-m-d H:i') }} ～ @if($info->close_at->format('Y-m-d H:i') !== '2099-12-31 23:59'){{ $info->close_at->format('Y-m-d H:i') }}@endif</td>
                        <td class="text-center">
                            <a href="{{ route('Admin.Manage.Information.Show', $info) }}" class="btn btn-default"><i class="fas fa-info-circle"></i> Detail</a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            <div>{{ $information->appends($search)->links() }}</div>
        </div>
    </div>

@endsection

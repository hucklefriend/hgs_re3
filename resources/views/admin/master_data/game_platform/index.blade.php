@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.MasterData.Platform') }}" method="GET">
                <table class="table table-borderless table-sm">
                    <tr>
                        <th class="align-middle">Name</th>
                        <td>{{ Form::text('name', $search['name'], ['class' => 'form-control', 'placeholder' => '名前 or 略称 or 俗称(半角スペースで単語区切り)', 'autocomplete' => 'off']) }}</td>
                    </tr>
                    <tr>
                        <th></th>
                        <td><button type="submit" class="btn btn-sm btn-primary w-100px me-5px">Search</button></td>
                    </tr>
                </table>
            </form>
        </div>
    </div>

    <div class="panel panel-inverse">
        <div class="panel-body">
            <div class="d-flex justify-content-between">
                <div>{{ $platforms->appends($search)->links() }}</div>
                <div class="text-end">
                    <a href="{{ route('Admin.MasterData.Platform.Add') }}" class="btn btn-default"><i class="fas fa-plus"></i> Add</a>
                    <a href="{{ route('Admin.MasterData.Platform.EditMulti', $search) }}" class="btn btn-default"><i class="fas fa-pen"></i> Edit Multi</a>
                </div>
            </div>

            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>名前</th>
                    <th>key</th>
                    <th>略称</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($platforms as $platform)
                    <tr>
                        <td>{{ $platform->id }}</td>
                        <td>{{ $platform->name }}</td>
                        <td>{{ $platform->key }}</td>
                        <td>{{ $platform->acronym }}</td>
                        <td class="text-center"><a href="{{ route('Admin.MasterData.Platform.Detail', $platform) }}" class="btn btn-default"><i class="fas fa-info-circle"></i> Detail</a></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div>{{ $platforms->appends($search)->links() }}</div>
        </div>
    </div>
    <!-- END panel -->

@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.MasterData.Maker.EditMulti') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Name</label>
                    <div class="col-md-9">
                        <input type="text" name="name" value="{{ $search['name'] ?? '' }}" class="form-control"
                               placeholder="名前 or よみがな or 略称(半角スペースで単語区切り)" autocomplete="off">
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
            <div>{{ $makers->appends($search)->links() }}</div>
            @include ('admin.all_errors')
            <form method="POST" action="{{ route('Admin.MasterData.Maker.UpdateMulti', $search) }}">
                @csrf
                {{ method_field('PUT') }}
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>タイトル</th>
                        <th>キー</th>
                        <th>ノード名</th>
                        <th>H1ノード名</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($makers as $model)
                        <tr>
                            <td>{{ $model->id }}</td>
                            <td>{{ $model->name }}</td>
                            <td><x-admin.multi-edit-input name="key" :model="$model" /></td>
                            <td><x-admin.multi-edit-textarea name="node_name" :model="$model" /></td>
                            <td><x-admin.multi-edit-textarea name="h1_node_name" :model="$model" /></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <div class="my-4 d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>

            <div>{{ $makers->appends($search)->links() }}</div>
        </div>
    </div>
@endsection


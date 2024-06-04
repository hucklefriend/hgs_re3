@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.MasterData.Title.EditMulti') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Name</label>
                    <div class="col-md-9">
                        {{ Form::text('name', $search['name'] ?? '', ['class' => 'form-control', 'placeholder' => '名前 or よみがな or 略称(半角スペースで単語区切り)', 'autocomplete' => 'off']) }}
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
            <form method="POST" action="{{ route('Admin.MasterData.Title.UpdateMulti', $search) }}">
                {{ csrf_field() }}
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
                    @foreach ($titles as $model)
                        <tr>
                            <td>{{ $model->id }}</td>
                            <td>{{ $model->name }}</td>
                            <td>{{ Form::textarea("key[{$model->id}]", old("key[{$model->id}]", $model->key), ['class' => 'form-control edit-multi-textarea']) }}</td>
                            <td>{{ Form::textarea("node_name[{$model->id}]", old("node_name[{$model->id}]", $model->node_name), ['class' => 'form-control edit-multi-textarea']) }}</td>
                            <td>{{ Form::textarea("h1_node_name[{$model->id}]", old("h1_node_name[{$model->id}]", $model->h1_node_name), ['class' => 'form-control edit-multi-textarea']) }}</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <div class="my-4 d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>

            <div>{{ $titles->appends($search)->links() }}</div>
        </div>
    </div>
@endsection



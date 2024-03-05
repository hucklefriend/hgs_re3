@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.MasterData.Series') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Name</label>
                    <div class="col-md-9">
                        {{ Form::text('name', $search['name'] ?? '', ['class' => 'form-control', 'placeholder' => '名前 or よみがな(半角スペースで単語区切り)', 'autocomplete' => 'off']) }}
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
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Series.Add') }}" class="btn btn-default"><i class="fas fa-plus"></i></a>
            </div>

            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>タイトル</th>
                    <th>よみがな</th>
                    <th>フランチャイズ</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($serieses as $series)
                    <tr>
                        <td>{{ $series->id }}</td>
                        <td>{{ $series->name }}</td>
                        <td>{{ $series->phonetic }}</td>
                        <td>{{ $series->franchise->name }}</td>
                        <td class="text-center"><a href="{{ route('Admin.MasterData.Series.Detail', $series) }}">Detail</a></td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            <div>{{ $serieses->appends($search)->links() }}</div>
        </div>
    </div>
@endsection

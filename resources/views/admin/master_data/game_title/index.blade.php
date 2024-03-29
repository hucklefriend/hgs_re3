@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.MasterData.Title') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">名前</label>
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
                <a href="{{ route('Admin.MasterData.Title.Add') }}" class="btn btn-default"><i class="fas fa-plus"></i></a>
            </div>

            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>タイトル</th>
                    <th>シリーズ</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($titles as $title)
                    <tr>
                        <td>{{ $title->id }}</td>
                        <td>{{ $title->name }}</td>
                        <td>{{ $title->series()->name ?? '' }}</td>
                        <td class="text-center">
                            <a href="{{ route('Admin.MasterData.Title.Detail', $title) }}" class="btn btn-default"><i class="fas fa-info-circle"></i> Detail</a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            <div>{{ $titles->appends($search)->links() }}</div>
        </div>
    </div>
@endsection

@section('js')
    <script>
        $(()=>{
            $("#franchise").select2();
            $("#series").select2();
        });
    </script>
@endsection

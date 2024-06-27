@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->head }}</h4>
        </div>
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.Manage.Information.Edit', $model) }}" class="btn btn-default"><i class="fas fa-edit"></i> Edit</a>
            </div>
            <table class="table admin-form-table" id="franchise-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $model->id }}</td>
                </tr>
                <tr>
                    <th>掲題</th>
                    <td>{!! $model->head !!}</td>
                </tr>
                <tr>
                    <th>本文</th>
                    <td>{!! nl2br($model->body) !!}</td>
                </tr>
                <tr>
                    <th>優先度</th>
                    <td>{{ $model->priority }}</td>
                </tr>
                <tr>
                    <th>掲載期間</th>
                    <td>{{ $model->open_at }} ～ {{ $model->close_at }}</td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="d-flex justify-content-between">
                <div>
                </div>
                <div class="text-end">
                    <form method="POST" action="{{ route('Admin.Manage.Information.Destroy', $model) }}" onsubmit="return confirm('削除します');">
                        @csrf
                        {{ method_field('DELETE') }}
                        <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> Delete</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}">
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.Title.SyncFranchise', $model) }}">
            {{ csrf_field() }}

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                @foreach ($franchises as $franchise)
                    <label class="list-group-item">
                        {{ Form::radio('franchise_id', $franchise->id, $franchise->id == ($model->franchise()->id ?? null), ['class' => 'form-check-input me-1']) }}
                        {{ $franchise->name }}
                    </label>
                @endforeach
                </div>
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.Title.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

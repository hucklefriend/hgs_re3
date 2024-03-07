@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.Series.SyncFranchise', $model) }}">
            {{ csrf_field() }}

            <div class="panel-body panel-inverse">
                <div class="list-group">
                @foreach ($franchises as $franchise)
                    <label class="list-group-item">
                        {{ Form::radio('franchise_id', $franchise->id, $franchise->id == ($model->franchise()->id ?? null), ['class' => 'form-check-input me-1']) }}
                        {{ $franchise->name }}
                    </label>
                @endforeach
                </div>
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.Series.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

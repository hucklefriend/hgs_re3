@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}">
        </div>
        <form method="POST" action="{{ route('Admin.Game.Title.SyncSeries', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                @foreach ($series as $seriesId => $seriesName)
                    <label class="list-group-item">
                        <input type="radio" name="series_id" value="{{ $seriesId }}" class="form-check-input me-1" @checked($seriesId == ($model->series()->id ?? null))>
                        {{ $seriesName }}
                    </label>
                @endforeach
                </div>
                @if ($errors->has('series_id'))
                    <div class="invalid-feedback">{{$errors->first('series_id')}}</div>
                @endif
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.Title.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}">
        </div>
        <form method="POST" action="{{ route('Admin.Game.Title.SyncPackageGroup', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                    @foreach ($packageGroups as $pg)
                        <label class="list-group-item">
                            <input type="checkbox" name="package_group_id[]" value="{{ $pg->id }}" class="form-check-input me-1" @checked(in_array($pg->id, $linkedPackageGroupIds))>
                            {{ $pg->name }}
                        </label>
                    @endforeach
                </div>
                @if ($errors->has('package_group_id'))
                    <div class="invalid-feedback">{{$errors->first('package_group_id')}}</div>
                @endif
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.Title.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

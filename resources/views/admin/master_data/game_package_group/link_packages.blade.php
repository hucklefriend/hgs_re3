@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <div class="panel-body">
            <div class="mb-3">
                <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}" placeholder="名前" autocomplete="off">
            </div>
            <div>
                <x-admin.select-game-platform-multi name="'platform_ids[]'" id="admin-link-platform-filter" />
            </div>
        </div>
        <form method="POST" action="{{ route('Admin.Game.PackageGroup.SyncPackage', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                    @foreach ($packages as $package)
                        <label class="list-group-item" data-platform="{{ $package->game_platform_id }}">
                            <input type="checkbox" name="package_id[]" value="{{ $package->id }}" class="form-check-input me-1" @checked(in_array($package->id, $linkedPackageIds))>
                            {{ $package->name }} ({{ $platformHash[$package->game_platform_id] }})
                        </label>
                    @endforeach
                </div>
                @if ($errors->has('package_id[]'))
                    <div class="invalid-feedback">{{ $errors->first('package_id[]') }}</div>
                @endif
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.PackageGroup.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

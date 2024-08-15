@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Link Platform</h4>
        </div>
        <div class="panel-body">
            <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}">
        </div>
        @include ('admin.all_errors')
        <form method="POST" action="{{ route('Admin.Game.RelatedProduct.SyncPlatform', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                @foreach ($platforms as $plt)
                    <label class="list-group-item">
                        <input type="checkbox" name="game_platform_ids[]" value="{{ $plt->id }}" class="form-check-input me-1" @checked(in_array($plt->id, $linkedPlatformIds))>
                        {{ $plt->name }}
                    </label>
                @endforeach
                </div>
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.RelatedProduct.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

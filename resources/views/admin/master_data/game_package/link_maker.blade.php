@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Maker Link</h4>
        </div>

        <div class="panel-body">
            <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}">
        </div>

        @include ('admin.all_errors')
        <form method="POST" action="{{ route('Admin.MasterData.Package.SyncMaker', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                @foreach ($makers as $m)
                    <label class="list-group-item">
                        <input type="checkbox" name="maker_id[]" value="{{ $m->id }}" class="form-check-input me-1" @checked(in_array($m->id, $linkedMakerIds))>
                        {{ $m->name }}
                    </label>
                @endforeach
                </div>
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.Package.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

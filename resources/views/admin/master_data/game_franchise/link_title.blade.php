@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Title Link</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.Franchise.SyncTitle', $model) }}">
            {{ csrf_field() }}

            <div class="panel-body panel-inverse">
                <div class="list-group">
                @foreach ($titles as $title)
                    <label class="list-group-item">
                        <input class="form-check-input me-1" type="checkbox" value="{{ $title->id }}" name="title_id[]">
                        {{ $title->name }}
                    </label>
                @endforeach
                </div>
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.Franchise.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

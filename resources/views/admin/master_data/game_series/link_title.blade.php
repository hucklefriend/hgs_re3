@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Link Title</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.Series.SyncTitle', $model) }}">
            {{ csrf_field() }}

            <div class="panel-body panel-inverse">
                <div class="list-group">
                @foreach ($titles as $title)
                    <label class="list-group-item">
                        {{ Form::checkbox('title_id[]', $title->id, in_array($title->id, $linkedTitleIds), ['class' => 'form-check-input me-1']) }}
                        {{ $title->name }}
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

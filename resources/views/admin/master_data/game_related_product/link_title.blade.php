@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Link Title</h4>
        </div>
        <div class="panel-body">
            <input type="text" class="form-control" id="admin-link-list-filter" value="{{ $defaultFilter ?? '' }}">
        </div>
        <form method="POST" action="{{ route('Admin.Game.RelatedProduct.SyncTitle', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                @foreach ($titles as $title)
                    <label class="list-group-item">
                        <input type="checkbox" name="title_id[]" value="{{ $title->id }}" class="form-check-input me-1" @checked(in_array($title->id, $linkedTitleIds))>
                        {{ $title->name }}
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

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
        </div>
        @include ('admin.all_errors')
        <form method="POST" action="{{ route('Admin.Game.Title.SyncMediaMix', $model) }}">
            @csrf

            <div class="panel-body panel-inverse">
                <div class="list-group" id="admin-link-list">
                    @foreach ($mediaMixes as $mm)
                        <label class="list-group-item">
                            <input type="checkbox" name="game_media_mix_ids[]" value="{{ $mm->id }}" class="form-check-input me-1" @checked(in_array($mm->id, $linkedMediaMixIds))>
                            {{ $mm->name }}
                        </label>
                    @endforeach
                </div>
                @if ($errors->has('game_media_mix_ids[]'))
                    <div class="invalid-feedback">{{ $errors->first('game_media_mix_ids[]') }}</div>
                @endif
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.Title.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

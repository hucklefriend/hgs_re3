@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.MediaMix.Update', $model) }}">
            @csrf
            {{ method_field('PUT') }}

            <div class="panel-body">
                @include('admin.master_data.game_media_mix.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.MediaMix.Detail', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

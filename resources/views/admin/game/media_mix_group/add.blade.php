@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New MediaMixGroup</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.MediaMixGroup.Store') }}">
            @csrf
            <div class="panel-body">
                @include('admin.game.media_mix_group.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.MediaMixGroup') }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

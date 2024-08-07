@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <form method="POST" action="{{ route('Admin.Game.Platform.Store') }}">
            @csrf
            <div class="panel-heading">
                <h4 class="panel-title">New Platform</h4>
            </div>
            <div class="panel-body">
                @include('admin.game.platform.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.Platform') }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

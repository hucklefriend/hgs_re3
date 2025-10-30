@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New Series</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.Series.Store') }}">
            @csrf
            <div class="panel-body">
                @include('admin.game.series.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.Series') }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

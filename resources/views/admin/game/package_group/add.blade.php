@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New PackageGroup</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Game.PackageGroup.Store') }}">
            @csrf
            <div class="panel-body">
                @include('admin.game.package_group.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Game.PackageGroup') }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
            <input type="hidden" name="linked" value="{{ $linked }}">
        </form>
    </div>
@endsection

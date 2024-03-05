@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Add</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.Package.Store') }}">
            {{ csrf_field() }}

            <div class="panel-body">
                @include('admin.game_package.form')
            </div>
            <div class="panel-footer text-end">
                <button type="submit" class="btn btn-default">Save</button>
            </div>
        </form>
    </div>
@endsection


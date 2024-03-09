@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New Package</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.Package.Store') }}">
            {{ csrf_field() }}

            <div class="panel-body">
                @include('admin.master_data.game_package.form', ['isAdd' => true])
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.Package') }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection


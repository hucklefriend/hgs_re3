@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New PackageShop</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.Package.StoreShop', $package) }}">
            {{ csrf_field() }}

            <div class="panel-body">
                @include('admin.master_data.game_package.form_shop', ['isEdit' => false])
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.Package.Detail', $package) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection
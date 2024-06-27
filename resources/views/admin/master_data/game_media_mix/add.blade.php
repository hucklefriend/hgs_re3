@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">New Media Mix</h4>
        </div>
        <form method="POST" action="{{ route('Admin.MasterData.MediaMix.Store') }}">
            @csrf
            <div class="panel-body">
                @include('admin.master_data.game_media_mix.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.MasterData.MediaMix') }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

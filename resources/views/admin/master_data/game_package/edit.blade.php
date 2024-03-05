@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        @foreach ($errors->all() as $error)
            <li>{{$error}}</li>
        @endforeach
        <form method="POST" action="{{ route('Admin.MasterData.Package.Update', $model) }}">
            {{ csrf_field() }}
            {{ method_field('PUT') }}

            <div class="panel-body">
                @include('admin.game_package.form')
            </div>
            <div class="panel-footer text-end">
                <button type="submit" class="btn btn-default">Save</button>
            </div>
        </form>
    </div>
@endsection

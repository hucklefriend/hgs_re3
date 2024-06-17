@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        @foreach ($errors->all() as $error)
            <li>{{$error}}</li>
        @endforeach
        <form method="POST" action="{{ route('Admin.MasterData.Package.MakeCopy', $model) }}">
            @csrf

            <div class="panel-body">
                @include('admin.master_data.game_package.form', ['isAdd' => false])
            </div>
            <div class="panel-footer text-end">
                <button type="submit" class="btn btn-primary">Copy</button>
            </div>
        </form>
    </div>
@endsection

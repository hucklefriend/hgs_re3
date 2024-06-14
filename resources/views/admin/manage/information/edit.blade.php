@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $model->name }}</h4>
        </div>
        <form method="POST" action="{{ route('Admin.Manage.Information.Update', $model) }}">
            {{ csrf_field() }}
            {{ method_field('PUT') }}

            <div class="panel-body">
                @include('admin.manage.information.form')
            </div>
            <div class="panel-footer text-end">
                <a href="{{ route('Admin.Manage.Information.Show', $model) }}" class="btn btn-default">Cancel</a>&nbsp;
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
@endsection

@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">{{ $title->name }}</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            @include ('admin.all_errors')
            <form method="POST" action="{{ route('Admin.Game.Title.UpdatePackageMulti', $title) }}">
                @csrf
                {{ method_field('PUT') }}

                <x-admin.node-input-support />
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>PLT</th>
                        <th>パッケージ名</th>
                        <th>ノード名</th>
                        <th>発売日</th>
                        <th>表示順</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($packages as $pkg)
                        <tr>
                            <td>{{ $pkg->id }}<input type="hidden" name="id[]" value="{{ $pkg->id }}"></td>
                            <td>{{ $pkg->platform->acronym }}</td>
                            <td><x-admin.multi-edit-input name="name" :model="$pkg" /></td>
                            <td><x-admin.multi-edit-textarea name="node_name" :model="$pkg" /></td>
                            <td><x-admin.multi-edit-input name="release_at" :model="$pkg" /></td>
                            <td><x-admin.multi-edit-input type="number" name="sort_order" :model="$pkg" /></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <div class="my-4 d-flex justify-content-end">
                    <a href="{{ route('Admin.Game.Title.Detail', $title) }}" class="btn btn-default">Cancel</a>&nbsp;
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>
        </div>
    </div>
@endsection

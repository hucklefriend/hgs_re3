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
            <form method="POST" action="{{ route('Admin.Game.Title.UpdatePackageGroupMulti', $title) }}">
                @csrf
                {{ method_field('PUT') }}

                <x-admin.node-input-support />
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>タイトル</th>
                        <th>ノード名</th>
                        <th>表示順</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($title->packageGroups as $pkgGroup)
                        <tr>
                            <td>{{ $pkgGroup->id }}<input type="hidden" name="id[]" value="{{ $pkgGroup->id }}"></td>
                            <td><x-admin.multi-edit-input name="name" :model="$pkgGroup" /></td>
                            <td><x-admin.multi-edit-textarea name="node_name" :model="$pkgGroup" /></td>
                            <td><x-admin.multi-edit-input type="number" name="sort_order" :model="$pkgGroup" /></td>
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

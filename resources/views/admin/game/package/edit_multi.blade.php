@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.Game.Package.EditMulti') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">名前</label>
                    <div class="col-md-9">
                        {{ html()->text('name', $search['name'])->class('form-control')->placeholder('名称など')->autocomplete('off') }}
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">プラットフォーム</label>
                    <div class="col-md-9">
                        <x-admin.select-game-platform-multi name="platform_ids[]" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-7 offset-md-3">
                        <button type="submit" class="btn btn-sm btn-primary w-100px me-5px">Search</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">List</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            <div>{{ $packages->appends($search)->links() }}</div>
            <form method="POST" action="{{ route('Admin.Game.Package.UpdateMulti', $search) }}">
                @csrf
                {{ method_field('PUT') }}

                <x-admin.node-input-support />
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>タイトル</th>
                        <th>ノード名</th>
                        <th>発売日</th>
                        <th>表示順</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($packages as $pkg)
                        <tr>
                            <td>{{ $pkg->id }}<input type="hidden" name="id[]" value="{{ $pkg->id }}"></td>
                            <td><x-admin.multi-edit-input name="name" :model="$pkg" /></td>
                            <td><x-admin.multi-edit-textarea name="node_name" :model="$pkg" /></td>
                            <td><x-admin.multi-edit-input name="release_at" :model="$pkg" /></td>
                            <td><x-admin.multi-edit-input type="number" name="sort_order" :model="$pkg" /></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
                <div class="my-4 d-flex justify-content-end">
                    <a href="{{ route('Admin.Game.Package') }}" class="btn btn-default">Cancel</a>&nbsp;
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </form>

            <div>{{ $packages->appends($search)->links() }}</div>
        </div>
    </div>
@endsection

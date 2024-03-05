@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-body">
            <div class="text-end">
                <a href="{{ route('Admin.MasterData.Platform.Add') }}" class="btn btn-default"><i class="fas fa-plus"></i></a>
            </div>

            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>タイトル</th>
                    <th>表示期間</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($platforms as $platform)
                    <tr>
                        <td>{{ $platform->id }}</td>
                        <td>{{ $platform->name }}</td>
                        <td>{{ $platform->acronym }}</td>
                        <td class="text-center"><a href="{{ route('Admin.MasterData.Platform.Detail', $platform) }}">Detail</a></td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div>{{ $platforms->links() }}</div>
        </div>
    </div>
    <!-- END panel -->

@endsection

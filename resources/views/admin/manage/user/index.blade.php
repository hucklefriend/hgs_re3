@extends('admin.layout')

@section('content')
    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show">
            <strong>成功!</strong> {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.Manage.User') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Status</label>
                    <div class="col-md-9">
                        <select name="status" class="form-select w-auto">
                            @foreach ($statuses as $value => $label)
                                <option value="{{ $value }}" {{ $search['status'] === $value ? 'selected' : '' }}>
                                    {{ $label }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Keyword</label>
                    <div class="col-md-9">
                        <input type="text" name="keyword" value="{{ $search['keyword'] }}" class="form-control" placeholder="名前 / メール / 表示ID">
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
            <h4 class="panel-title">User List</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            <div class="d-flex justify-content-between">
                <div>{{ $users->appends($search)->links() }}</div>
            </div>
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Show ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Withdrawn</th>
                    <th>Sign Up At</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($users as $user)
                    <tr>
                        <td>{{ $user->id }}</td>
                        <td><code>{{ $user->show_id ?? '-' }}</code></td>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>{{ $user->role ?? '-' }}</td>
                        <td>
                            @if ($user->withdrawn_at)
                                <span class="badge bg-danger">{{ $user->withdrawn_at->format('Y-m-d') }}</span>
                            @else
                                <span class="badge bg-success">在籍</span>
                            @endif
                        </td>
                        <td>{{ $user->sign_up_at?->format('Y-m-d H:i') ?? '-' }}</td>
                        <td class="text-center">
                            <a href="{{ route('Admin.Manage.User.Show', $user) }}" class="btn btn-default btn-sm"><i class="fas fa-info-circle"></i> Detail</a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            @if($users->isEmpty())
                <div class="alert alert-warning text-center">
                    ユーザーが見つかりませんでした。
                </div>
            @endif

            <div>{{ $users->appends($search)->links() }}</div>
        </div>
    </div>
@endsection



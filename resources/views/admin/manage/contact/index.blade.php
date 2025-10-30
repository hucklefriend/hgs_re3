@extends('admin.layout')

@section('content')
    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.Manage.Contact') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Status</label>
                    <div class="col-md-9">
                        <select name="status" class="form-select w-auto">
                            <option value="">All</option>
                            @foreach ($statuses as $status)
                                <option value="{{ $status->value }}" {{ $search['status'] === strval($status->value) ? 'selected' : '' }}>
                                    {{ $status->label() }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">Keyword</label>
                    <div class="col-md-9">
                        <input type="text" name="keyword" value="{{ $search['keyword'] }}" class="form-control" placeholder="名前、件名、内容、カテゴリーで検索">
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
            <h4 class="panel-title">Contact List</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            <div class="d-flex justify-content-between">
                <div>{{ $contacts->appends($search)->links() }}</div>
            </div>
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Responses</th>
                    <th>Created At</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($contacts as $contact)
                    <tr>
                        <td>{{ $contact->id }}</td>
                        <td>
                            @php
                                $statusColors = [
                                    0 => 'warning',  // 未対応
                                    1 => 'primary',  // 対応中
                                    2 => 'success',  // 完了
                                    3 => 'secondary', // クローズ
                                    4 => 'danger'    // 取り消し
                                ];
                                $color = $statusColors[$contact->status->value] ?? 'secondary';
                            @endphp
                            <span class="badge bg-{{ $color }}">{{ $contact->status->label() }}</span>
                        </td>
                        <td>{{ $contact->name }}</td>
                        <td>{{ $contact->category?->label() ?? '-' }}</td>
                        <td>{{ $contact->responses->count() }}</td>
                        <td>{{ $contact->created_at->format('Y-m-d H:i') }}</td>
                        <td class="text-center">
                            <a href="{{ route('Admin.Manage.Contact.Show', $contact) }}" class="btn btn-default btn-sm"><i class="fas fa-info-circle"></i> Detail</a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>

            @if($contacts->isEmpty())
                <div class="alert alert-warning text-center">
                    問い合わせが見つかりませんでした。
                </div>
            @endif

            <div>{{ $contacts->appends($search)->links() }}</div>
        </div>
    </div>

@endsection


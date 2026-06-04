@extends('admin.layout')

@section('content')
    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    @if (session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">取り込み実行</h4>
        </div>
        <div class="panel-body">
            <form method="POST" action="{{ route('Admin.Manage.RssArticle.ExecuteFetch') }}"
                  onsubmit="return confirm('RSSの取り込みを実行します。完了まで時間がかかる場合があります。よろしいですか？');">
                @csrf
                <div class="row align-items-center">
                    <label class="form-label col-form-label col-md-2">ソース</label>
                    <div class="col-md-4">
                        <select name="source" class="form-select">
                            <option value="">全ソース</option>
                            @foreach ($sources as $src)
                                <option value="{{ $src->value }}">{{ $src->label() }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-sync"></i> 取り込み実行</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">取り込み実行履歴</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            <div class="mb-2">{{ $logs->links() }}</div>
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ソース</th>
                    <th>ステータス</th>
                    <th>新着記事数</th>
                    <th>所要時間</th>
                    <th>開始日時</th>
                    <th>完了日時</th>
                    <th>エラー</th>
                </tr>
                </thead>
                <tbody>
                @forelse ($logs as $log)
                    <tr>
                        <td>{{ $log->id }}</td>
                        <td>{{ $log->sourceLabel() }}</td>
                        <td>
                            @if ($log->isRunning())
                                <span class="badge bg-warning text-dark">実行中</span>
                            @elseif ($log->isSuccess())
                                <span class="badge bg-success">成功</span>
                            @else
                                <span class="badge bg-danger">エラー</span>
                            @endif
                        </td>
                        <td>{{ $log->new_article_count }}</td>
                        <td>
                            @if ($log->elapsedSeconds() !== null)
                                {{ $log->elapsedSeconds() }}秒
                            @else
                                —
                            @endif
                        </td>
                        <td>{{ $log->started_at->format('Y-m-d H:i:s') }}</td>
                        <td>{{ $log->finished_at?->format('Y-m-d H:i:s') }}</td>
                        <td class="text-break" style="max-width:200px;">{{ $log->error_message }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="text-center text-muted">履歴なし</td>
                    </tr>
                @endforelse
                </tbody>
            </table>
            <div>{{ $logs->links() }}</div>
        </div>
    </div>

    <div class="mt-2">
        <a href="{{ route('Admin.Manage.RssArticle') }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 記事一覧へ</a>
    </div>
@endsection

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
                  onsubmit="return confirm('RSSの取り込みを実行します。よろしいですか？');">
                @csrf
                <div class="row align-items-center">
                    <label class="form-label col-form-label col-md-2">ソース</label>
                    <div class="col-md-3">
                        <select name="source" class="form-select">
                            <option value="">全ソース</option>
                            @foreach ($sources as $src)
                                <option value="{{ $src->value }}">{{ $src->label() }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 d-flex align-items-center gap-3">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-sync"></i> 取り込み実行</button>
                        @if ($latestFetchLog)
                            <span class="text-muted small">
                                最終取り込み:
                                {{ $latestFetchLog->sourceLabel() }}
                                {{ $latestFetchLog->started_at->format('Y-m-d H:i') }}
                                @if ($latestFetchLog->isSuccess())
                                    <span class="text-success">（{{ $latestFetchLog->new_article_count }}件）</span>
                                @elseif ($latestFetchLog->isError())
                                    <span class="text-danger">（エラー）</span>
                                @else
                                    <span class="text-warning">（実行中）</span>
                                @endif
                            </span>
                        @endif
                    </div>
                    <div class="col-md-3 text-end">
                        <a href="{{ route('Admin.Manage.RssArticle.FetchLog') }}" class="btn btn-default btn-sm"><i class="fas fa-history"></i> 取り込み履歴</a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">Search</h4>
        </div>
        <div class="panel-body">
            <form action="{{ route('Admin.Manage.RssArticle') }}" method="GET">
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">ソース</label>
                    <div class="col-md-9">
                        <select name="source" class="form-select w-auto">
                            <option value="">すべて</option>
                            @foreach ($sources as $src)
                                <option value="{{ $src->value }}" @selected($search['source'] === $src->value)>{{ $src->label() }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="row mb-3">
                    <label class="form-label col-form-label col-md-3">ホラーキーワードのみ</label>
                    <div class="col-md-9 d-flex align-items-center">
                        <input type="checkbox" name="horror_only" value="1" @checked(!empty($search['horror_only'])) class="form-check-input ms-1">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-9 offset-md-3">
                        <button type="submit" class="btn btn-sm btn-primary w-100px me-5px">Search</button>
                        <a href="{{ route('Admin.Manage.RssArticle') }}" class="btn btn-sm btn-default">Reset</a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">RSS記事一覧</h4>
            <div class="panel-heading-btn">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-default" data-toggle="panel-expand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <div class="panel-body">
            <div class="mb-2">{{ $articles->appends($search)->links() }}</div>
            <table class="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ソース</th>
                    <th>URL</th>
                    <th>マッチフランチャイズ</th>
                    <th>ホラーKW</th>
                    <th>公開日</th>
                    <th>取込日</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                @foreach ($articles as $article)
                    <tr>
                        <td>{{ $article->id }}</td>
                        <td>{{ $article->rss_source->label() }}</td>
                        <td class="text-truncate" style="max-width:280px;">
                            <a href="{{ $article->url }}" target="_blank">{{ $article->url }}</a>
                        </td>
                        <td>
                            <div class="d-flex flex-wrap gap-1">
                                @foreach ($article->matchedFranchises as $franchise)
                                    <span class="badge bg-secondary">{{ $franchise->name }}</span>
                                @endforeach
                            </div>
                        </td>
                        <td class="text-center">
                            @if ($article->has_horror_keyword)
                                <span class="badge bg-danger">あり</span>
                            @endif
                        </td>
                        <td>{{ $article->published_at?->format('Y-m-d') }}</td>
                        <td>{{ $article->created_at->format('Y-m-d H:i') }}</td>
                        <td class="text-center">
                            <a href="{{ route('Admin.Manage.RssArticle.Show', $article) }}" class="btn btn-sm btn-default"><i class="fas fa-info-circle"></i> Detail</a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <div>{{ $articles->appends($search)->links() }}</div>
        </div>
    </div>
@endsection

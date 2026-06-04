@extends('admin.layout')

@section('content')
    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="panel panel-inverse">
        <div class="panel-heading">
            <h4 class="panel-title">RSS記事 #{{ $article->id }}</h4>
        </div>
        <div class="panel-body">
            <table class="table admin-form-table">
                <tr>
                    <th>ID</th>
                    <td>{{ $article->id }}</td>
                </tr>
                <tr>
                    <th>ソース</th>
                    <td>{{ $article->rss_source->label() }}</td>
                </tr>
                <tr>
                    <th>URL</th>
                    <td><a href="{{ $article->url }}" target="_blank">{{ $article->url }}</a></td>
                </tr>
                <tr>
                    <th>GUID</th>
                    <td class="text-break">{{ $article->guid }}</td>
                </tr>
                <tr>
                    <th>ホラーキーワード</th>
                    <td>
                        @if ($article->has_horror_keyword)
                            <span class="badge bg-danger">あり</span>
                        @else
                            <span class="text-muted">なし</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>マッチフランチャイズ</th>
                    <td>
                        <div class="d-flex flex-wrap gap-1">
                            @forelse ($article->matchedFranchises as $franchise)
                                <span class="badge bg-secondary">{{ $franchise->name }}</span>
                            @empty
                                <span class="text-muted">なし</span>
                            @endforelse
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>OGPキャッシュ</th>
                    <td>
                        @if ($article->ogpCache)
                            <span class="badge bg-success">取得済</span>
                            @if ($article->ogpCache->title)
                                <span class="ms-2">{{ $article->ogpCache->title }}</span>
                            @endif
                            @if ($article->ogpCache->image_url)
                                <div class="mt-1"><img src="{{ $article->ogpCache->image_url }}" alt="OGP" style="max-height:80px;"></div>
                            @endif
                        @else
                            <span class="text-muted">未取得</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>タイムライン</th>
                    <td>
                        @if ($article->timelineEvents->isNotEmpty())
                            <span class="badge bg-primary">掲載中 ({{ $article->timelineEvents->count() }}件)</span>
                        @else
                            <span class="text-muted">未掲載</span>
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>公開日</th>
                    <td>{{ $article->published_at?->format('Y-m-d H:i') }}</td>
                </tr>
                <tr>
                    <th>取込日時</th>
                    <td>{{ $article->created_at->format('Y-m-d H:i:s') }}</td>
                </tr>
            </table>
        </div>
        <div class="panel-footer">
            <div class="d-flex justify-content-between">
                <div>
                    <a href="{{ route('Admin.Manage.RssArticle') }}" class="btn btn-default"><i class="fas fa-arrow-left"></i> 一覧へ</a>
                </div>
                <div class="d-flex gap-2">
                    @if ($article->timelineEvents->isNotEmpty())
                        <form method="POST" action="{{ route('Admin.Manage.RssArticle.DestroyTimelineEvent', $article) }}"
                              onsubmit="return confirm('タイムラインから削除します。記事データは残ります。よろしいですか？');">
                            @csrf
                            {{ method_field('DELETE') }}
                            <button class="btn btn-warning" type="submit"><i class="fas fa-eye-slash"></i> タイムラインから削除</button>
                        </form>
                    @endif
                    <form method="POST" action="{{ route('Admin.Manage.RssArticle.Destroy', $article) }}"
                          onsubmit="return confirm('記事を完全に削除します。タイムラインからも消えます。よろしいですか？');">
                        @csrf
                        {{ method_field('DELETE') }}
                        <button class="btn btn-danger" type="submit"><i class="fas fa-eraser"></i> 記事を削除</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection

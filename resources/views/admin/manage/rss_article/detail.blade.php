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
                        @php $matchedIds = $article->matchedFranchises->pluck('id')->all(); @endphp
                        <form id="franchise-form" method="POST" action="{{ route('Admin.Manage.RssArticle.UpdateFranchises', $article) }}">
                            @csrf
                            {{ method_field('PUT') }}
                            <div class="d-flex align-items-start gap-2">
                                <div style="width:260px;">
                                    <input type="text" id="franchise-search" class="form-control form-control-sm mb-1" placeholder="絞り込み...">
                                    <select id="franchise-available" multiple size="12" class="form-control" style="width:260px;">
                                        @foreach ($allFranchises as $franchise)
                                            @if (!in_array($franchise->id, $matchedIds))
                                                <option value="{{ $franchise->id }}">{{ $franchise->name }}</option>
                                            @endif
                                        @endforeach
                                    </select>
                                    <div class="text-muted small mt-1">未選択 (<span id="available-count"></span>)</div>
                                </div>
                                <div class="d-flex flex-column justify-content-center gap-1 mt-4">
                                    <button type="button" id="btn-add" class="btn btn-sm btn-default" title="追加">→</button>
                                    <button type="button" id="btn-remove" class="btn btn-sm btn-default" title="削除">←</button>
                                </div>
                                <div style="width:260px;">
                                    <div class="mb-1" style="height:31px; line-height:31px; font-size:.85rem;">選択済み</div>
                                    <select id="franchise-selected" name="franchise_ids[]" multiple size="12" class="form-control" style="width:260px;">
                                        @foreach ($allFranchises as $franchise)
                                            @if (in_array($franchise->id, $matchedIds))
                                                <option value="{{ $franchise->id }}" selected>{{ $franchise->name }}</option>
                                            @endif
                                        @endforeach
                                    </select>
                                    <div class="text-muted small mt-1">選択済み (<span id="selected-count"></span>)</div>
                                </div>
                            </div>
                            <div class="mt-2">
                                <button type="submit" class="btn btn-sm btn-primary">保存</button>
                            </div>
                        </form>
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

@section('js')
<script>
$(function () {
    var $available = $('#franchise-available');
    var $selected  = $('#franchise-selected');
    var $search    = $('#franchise-search');
    var $availCount = $('#available-count');
    var $selCount   = $('#selected-count');

    function updateCounts() {
        $availCount.text($available.find('option').length);
        $selCount.text($selected.find('option').length);
    }

    function moveOptions($from, $to) {
        $from.find('option:selected').appendTo($to);
        var sorted = $to.find('option').sort(function (a, b) {
            return $(a).text().localeCompare($(b).text(), 'ja');
        });
        $to.empty().append(sorted);
        updateCounts();
    }

    $('#btn-add').on('click', function () { moveOptions($available, $selected); });
    $('#btn-remove').on('click', function () { moveOptions($selected, $available); });

    $available.on('dblclick', 'option', function () {
        $(this).prop('selected', true);
        moveOptions($available, $selected);
    });
    $selected.on('dblclick', 'option', function () {
        $(this).prop('selected', true);
        moveOptions($selected, $available);
    });

    $search.on('input', function () {
        var q = $(this).val().toLowerCase();
        $available.find('option').each(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(q) !== -1);
        });
    });

    $('#franchise-form').on('submit', function () {
        $selected.find('option').prop('selected', true);
    });

    updateCounts();
});
</script>
@endsection

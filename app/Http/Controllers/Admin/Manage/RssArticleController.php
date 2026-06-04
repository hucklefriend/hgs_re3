<?php

namespace App\Http\Controllers\Admin\Manage;

use App\Defines\AdminDefine;
use App\Enums\RssSource;
use App\Enums\TimelineSubjectType;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Models\RssArticle;
use App\Models\RssFetchLog;
use App\Models\TimelineEvent;
use App\Services\Rss\RssFetchService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RssArticleController extends AbstractAdminController
{
    public function index(Request $request): View
    {
        return view('admin.manage.rss_article.index', $this->search($request));
    }

    private function search(Request $request): array
    {
        $query = RssArticle::with(['matchedFranchises', 'ogpCache'])->orderByDesc('created_at');

        $source     = $request->query('source', '');
        $horrorOnly = $request->boolean('horror_only');
        $search = [
            'source'      => $source,
            'horror_only' => $horrorOnly ? '1' : '',
        ];

        if ($source !== '') {
            $query->where('rss_source', $source);
        }
        if ($horrorOnly) {
            $query->where('has_horror_keyword', true);
        }

        $this->saveSearchSession($search);

        return [
            'search'       => $search,
            'articles'     => $query->paginate(AdminDefine::ITEMS_PER_PAGE),
            'sources'      => RssSource::cases(),
            'latestFetchLog' => RssFetchLog::orderByDesc('started_at')->first(),
        ];
    }

    public function show(RssArticle $rssArticle): View
    {
        $rssArticle->load(['matchedFranchises', 'ogpCache', 'timelineEvents']);

        return view('admin.manage.rss_article.detail', [
            'article' => $rssArticle,
        ]);
    }

    public function destroyTimelineEvent(RssArticle $rssArticle): RedirectResponse
    {
        TimelineEvent::where('subject_type', TimelineSubjectType::RssArticle->value)
            ->where('subject_id', $rssArticle->id)
            ->delete();

        return redirect()->route('Admin.Manage.RssArticle.Show', $rssArticle)
            ->with('success', 'タイムラインから削除しました。');
    }

    public function destroy(RssArticle $rssArticle): RedirectResponse
    {
        TimelineEvent::where('subject_type', TimelineSubjectType::RssArticle->value)
            ->where('subject_id', $rssArticle->id)
            ->delete();
        $rssArticle->delete();

        return redirect()->route('Admin.Manage.RssArticle')
            ->with('success', '記事を削除しました。');
    }

    public function fetchLog(): View
    {
        $logs = RssFetchLog::orderByDesc('started_at')->paginate(AdminDefine::ITEMS_PER_PAGE);

        return view('admin.manage.rss_article.fetch_log', [
            'logs'    => $logs,
            'sources' => RssSource::cases(),
        ]);
    }

    public function executeFetch(Request $request, RssFetchService $fetchService): RedirectResponse
    {
        $sourceValue = $request->input('source', '');
        $source      = $sourceValue !== '' ? RssSource::tryFrom($sourceValue) : null;

        $log = RssFetchLog::create([
            'rss_source' => $source?->value,
            'status'     => 'running',
            'started_at' => now(),
        ]);

        try {
            if ($source !== null) {
                $fetchService->fetchBySource($source, $log);
            } else {
                $fetchService->fetchAll($log);
            }
        } catch (\Throwable $e) {
            $log->status        = 'error';
            $log->error_message = $e->getMessage();
            $log->finished_at   = now();
            $log->save();

            return redirect()->route('Admin.Manage.RssArticle.FetchLog')
                ->with('error', '取り込み処理でエラーが発生しました: ' . $e->getMessage());
        }

        return redirect()->route('Admin.Manage.RssArticle.FetchLog')
            ->with('success', "取り込み完了。新着記事: {$log->new_article_count} 件");
    }
}

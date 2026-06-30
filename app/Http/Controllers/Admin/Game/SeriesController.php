<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Http\Requests\Admin\Game\SeriesRequest;
use App\Models\Extensions\GameTree;
use App\Models\GameSeries;
use App\Models\MasterJsonImportLog;
use App\Services\MasterJson\SeriesMasterJsonService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SeriesController extends AbstractAdminController
{
    public function __construct(
        private readonly SeriesMasterJsonService $seriesMasterJsonService,
    ) {
    }

    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.series.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $series = \App\Models\GameSeries::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $series->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->where('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession($search);

        return  [
            'series' => $series->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ];
    }

    /**
     * 詳細
     *
     * @param GameSeries $series
     * @return Application|Factory|View
     */
    public function detail(GameSeries $series): Application|Factory|View
    {
        return view('admin.game.series.detail', [
            'model' => $series,
            'tree'  => GameTree::getTree($series),
        ]);
    }

    /**
     * AIに渡すJSONの出力画面
     *
     * @param GameSeries $series
     * @return Application|Factory|View
     */
    public function jsonExport(GameSeries $series): Application|Factory|View
    {
        return view('admin.game.series.json_export', [
            'model' => $series,
            'json'  => json_encode($this->seriesMasterJsonService->export($series), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * AIが書き換えたJSONの貼り付け画面
     *
     * @param GameSeries $series
     * @return Application|Factory|View
     */
    public function jsonImport(GameSeries $series): Application|Factory|View
    {
        return view('admin.game.series.json_import', [
            'model' => $series,
        ]);
    }

    /**
     * 貼り付けられたJSONと現在のデータの差分を表示
     *
     * @param Request $request
     * @param GameSeries $series
     * @return Application|Factory|View|RedirectResponse
     */
    public function jsonDiff(Request $request, GameSeries $series): Application|Factory|View|RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $diff = $this->seriesMasterJsonService->diff($series, $importedJson);

        if (!empty($diff['errors'])) {
            return redirect()->route('Admin.Game.Series.JsonImport', $series)
                ->withErrors(['imported_json' => implode(' / ', $diff['errors'])])
                ->withInput();
        }

        return view('admin.game.series.json_diff', [
            'model'        => $series,
            'diff'         => $diff,
            'importedJson' => $importedJson,
        ]);
    }

    /**
     * 採用された差分をデータへ反映
     *
     * @param Request $request
     * @param GameSeries $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function jsonApply(Request $request, GameSeries $series): RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $accept = $request->input('accept', []);
        $beforeJson = json_encode($this->seriesMasterJsonService->export($series), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        try {
            $applied = $this->seriesMasterJsonService->apply($series, $importedJson, $accept);
        } catch (\Throwable $e) {
            return redirect()->route('Admin.Game.Series.JsonImport', $series)
                ->withErrors(['imported_json' => $e->getMessage()])
                ->withInput();
        }

        MasterJsonImportLog::create([
            'admin_user_id'     => Auth::guard('admin')->id(),
            'target_type'       => 'series',
            'target_id'         => $series->id,
            'before_json'       => $beforeJson,
            'imported_json'     => $importedJson,
            'applied_diff_json' => json_encode($applied, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

        return redirect()->route('Admin.Game.Series.Detail', $series)
            ->with('success', 'JSONの内容をデータに反映しました。');
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game.series.add', [
            'model' => new \App\Models\GameSeries(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param SeriesRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(SeriesRequest $request): RedirectResponse
    {
        $series = new GameSeries();
        $series->fill($request->validated());
        $series->save();

        return redirect()->route('Admin.Game.Series.Detail', $series);
    }

    /**
     * 編集画面
     *
     * @param \App\Models\GameSeries $series
     * @return Application|Factory|View
     */
    public function edit(\App\Models\GameSeries $series): Application|Factory|View
    {
        return view('admin.game.series.edit', [
            'model' => $series
        ]);
    }

    /**
     * 更新処理
     *
     * @param SeriesRequest $request
     * @param \App\Models\GameSeries $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(SeriesRequest $request, GameSeries $series): RedirectResponse
    {
        $oldFranchise = $series->franchise;

        $series->fill($request->validated());
        $series->save();

        $franchise = $series->franchise;
        if ($franchise !== null) {
            $franchise->setTitleParam();
            $franchise->save();
        }
        
        if ($oldFranchise !== null) {
            $oldFranchise->setTitleParam();
            $oldFranchise->save();
        }

        return redirect()->route('Admin.Game.Series.Detail', $series);
    }

    /**
     * 削除
     *
     * @param GameSeries $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(\App\Models\GameSeries $series): RedirectResponse
    {
        $oldFranchise = $series->franchise;

        foreach ($series->titles as $title) {
            $title->game_series_id = null;
            $title->save();
        }
        $series->delete();

        if ($oldFranchise !== null) {
            $oldFranchise->setTitleParam();
            $oldFranchise->save();
        }

        return redirect()->route('Admin.Game.Series');
    }

    /**
     * タイトルとリンク
     *
     * @param GameSeries $series
     * @return Application|Factory|View
     */
    public function linkTitle(\App\Models\GameSeries $series): Application|Factory|View
    {
        $titles = \App\Models\GameTitle::orderBy('id')->get(['id', 'name']);
        return view('admin.game.series.link_title', [
            'model'          => $series,
            'linkedTitleIds' => $series->titles()->pluck('id')->toArray(),
            'titles'         => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param LinkMultiTitleRequest $request
     * @param GameSeries $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function syncTitle(LinkMultiTitleRequest $request, GameSeries $series): RedirectResponse
    {
        try {
            DB::beginTransaction();

            foreach ($series->titles as $title) {
                $title->game_series_id = null;
                $title->save();
            }
            foreach ($request->validated('game_title_ids') as $titleId) {
                $title = \App\Models\GameTitle::find($titleId);
                $title->game_franchise_id = null;
                $title->game_series_id = $series->id;
                $title->save();
            }

            $franchise = $series->franchise;
            if ($franchise !== null) {
                $franchise->setTitleParam();
                $franchise->save();
            }

            $series->setTitleParam();
            $series->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return redirect()->route('Admin.Game.Series.Detail', $series);
    }
}

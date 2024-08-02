<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\GameFranchiseSeriesLinkRequest;
use App\Http\Requests\Admin\Game\GameSeriesFranchiseLinkRequest;
use App\Http\Requests\Admin\Game\GameSeriesTitleLinkRequest;
use App\Models\Game\GameFranchise;
use App\Models\Game\GameSeries;
use App\Http\Requests\Admin\Game\GameSeriesRequest;
use App\Models\Game\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GameSeriesController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.master_data.game_series.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $series = GameSeries::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $series->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                    $query->orWhere('phonetic', operator: 'LIKE', value: '%' . $word . '%');
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
        return view('admin.master_data.game_series.detail', [
            'model' => $series
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.master_data.game_series.add', [
            'model' => new GameSeries(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param GameSeriesRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GameSeriesRequest $request): RedirectResponse
    {
        $series = new GameSeries();
        $series->fill($request->validated());
        $series->save();

        return redirect()->route('Admin.Game.Series.Detail', $series);
    }

    /**
     * 編集画面
     *
     * @param GameSeries $series
     * @return Application|Factory|View
     */
    public function edit(GameSeries $series): Application|Factory|View
    {
        return view('admin.master_data.game_series.edit', [
            'model' => $series
        ]);
    }

    /**
     * 更新処理
     *
     * @param GameSeriesRequest $request
     * @param GameSeries $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GameSeriesRequest $request, GameSeries $series): RedirectResponse
    {
        $series->fill($request->validated());
        $series->save();

        return redirect()->route('Admin.Game.Series.Detail', $series);
    }

    /**
     * 削除
     *
     * @param GameSeries $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GameSeries $series): RedirectResponse
    {
        $series->titles()->detach();
        $series->delete();

        return redirect()->route('Admin.Game.Series');
    }

    /**
     * フランチャイズとリンク
     *
     * @param GameSeries $series
     * @return Application|Factory|View
     */
    public function linkFranchise(GameSeries $series): Application|Factory|View
    {
        $franchises = GameFranchise::orderBy('id')->get(['id', 'name']);
        return view('admin.master_data.game_series.link_franchise', [
            'model' => $series,
            'franchises' => $franchises,
        ]);
    }

    /**
     * フランチャイズと同期処理
     *
     * @param GameSeriesFranchiseLinkRequest $request
     * @param GameSeries $series
     * @return RedirectResponse
     */
    public function syncFranchise(GameSeriesFranchiseLinkRequest $request, GameSeries $series): RedirectResponse
    {
        if ($series->franchise()) {
            $series->franchise()->series()->detach($series->id);
        }

        $franchise = GameFranchise::find($request->validated('franchise_id'));
        $franchise->series()->attach($series->id);

        return redirect()->route('Admin.Game.Series.Detail', $series);
    }

    /**
     * タイトルとリンク
     *
     * @param GameSeries $series
     * @return Application|Factory|View
     */
    public function linkTitle(GameSeries $series): Application|Factory|View
    {
        $titles = GameTitle::orderBy('id')->get(['id', 'name']);
        return view('admin.master_data.game_series.link_title', [
            'model' => $series,
            'linkedTitleIds' => $series->titles()->pluck('id')->toArray(),
            'titles' => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param GameSeriesTitleLinkRequest $request
     * @param GameSeries $series
     * @return RedirectResponse
     */
    public function syncTitle(GameSeriesTitleLinkRequest $request, GameSeries $series): RedirectResponse
    {
        $series->titles()->sync($request->validated('title_id'));
        return redirect()->route('Admin.Game.Series.Detail', $series);
    }
}

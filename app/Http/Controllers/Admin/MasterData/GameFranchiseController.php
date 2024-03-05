<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\MasterData\GameFranchiseTitleLinkRequest;
use App\Models\MasterData\GameFranchise;
use App\Models\MasterData\GameSeries;
use App\Http\Requests\Admin\MasterData\GameFranchiseRequest;
use App\Http\Requests\Admin\MasterData\GameFranchiseSeriesLinkRequest;
use App\Models\MasterData\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GameFranchiseController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        $franchises = GameFranchise::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $franchises->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                    $query->orWhere('phonetic', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession('search_game_franchise', $search);

        return view('admin.master_data.game_franchise.index', [
            'franchises' => $franchises->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ]);
    }

    /**
     * 詳細
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function detail(GameFranchise $franchise): Application|Factory|View
    {
        return view('admin.master_data.game_franchise.detail', [
            'model' => $franchise
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.master_data.game_franchise.add', [
            'model' => new GameFranchise(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param GameFranchiseRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GameFranchiseRequest $request): RedirectResponse
    {
        $franchise = new GameFranchise();
        $franchise->fill($request->validated());
        $franchise->save();

        return redirect()->route('Admin.MasterData.Franchise');
    }

    /**
     * 編集画面
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function edit(GameFranchise $franchise): Application|Factory|View
    {
        return view('admin.master_data.game_franchise.edit', [
            'model' => $franchise
        ]);
    }

    /**
     * 更新処理
     *
     * @param GameFranchiseRequest $request
     * @param GameFranchise $franchise
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GameFranchiseRequest $request, GameFranchise $franchise): RedirectResponse
    {
        $franchise->fill($request->validated());
        $franchise->save();

        return redirect()->route('Admin.MasterData.Franchise');
    }

    /**
     * 削除
     *
     * @param GameFranchise $franchise
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GameFranchise $franchise): RedirectResponse
    {
        $franchise->delete();

        return redirect()->route('Admin.MasterData.Franchise');
    }

    /**
     * シリーズとリンク
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function linkSeries(GameFranchise $franchise): Application|Factory|View
    {
        $series = GameSeries::orderBy('id')->get(['id', 'name']);
        return view('admin.master_data.game_franchise.link_series', [
            'model' => $franchise,
            'series' => $series,
        ]);
    }

    /**
     * シリーズと同期処理
     *
     * @param GameFranchiseSeriesLinkRequest $request
     * @param GameFranchise $franchise
     * @return RedirectResponse
     */
    public function syncSeries(GameFranchiseSeriesLinkRequest $request, GameFranchise $franchise): RedirectResponse
    {
        $franchise->series()->sync($request->validated('series_id'));
        return redirect()->route('Admin.MasterData.Franchise.Detail', $franchise);
    }

    /**
     * タイトルとリンク
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function linkTitle(GameFranchise $franchise): Application|Factory|View
    {
        $titles = GameTitle::orderBy('id')
            ->whereNotIn('id', function ($query){
                $query->select('game_title_id')
                    ->from('game_series_title_links');
            })
            ->get(['id', 'name']);
        return view('admin.master_data.game_franchise.link_title', [
            'model' => $franchise,
            'titles' => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param GameFranchiseTitleLinkRequest $request
     * @param GameFranchise $franchise
     * @return RedirectResponse
     */
    public function syncTitle(GameFranchiseTitleLinkRequest $request, GameFranchise $franchise): RedirectResponse
    {
        $franchise->titles()->sync($request->validated('title_id'));
        return redirect()->route('Admin.MasterData.Franchise.Detail', $franchise);
    }
}

<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\FranchiseMultiUpdateRequest;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Models\Game\GameFranchise;
use App\Models\Game\GameSeries;
use App\Http\Requests\Admin\Game\FranchiseRequest;
use App\Http\Requests\Admin\Game\GameFranchiseSeriesLinkRequest;
use App\Models\Game\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FranchiseController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.franchise.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
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

        $this->saveSearchSession($search);

        return [
            'franchises' => $franchises->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ];
    }

    /**
     * 詳細
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function detail(GameFranchise $franchise): Application|Factory|View
    {
        return view('admin.game.franchise.detail', [
            'model' => $franchise
        ]);
    }

    /**
     * リンクツリー
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function linkTree(GameFranchise $franchise): Application|Factory|View
    {
        return view('admin.game.franchise.link_tree', [
            'franchise' => $franchise
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game.franchise.add', [
            'model' => new GameFranchise(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param FranchiseRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(FranchiseRequest $request): RedirectResponse
    {
        $franchise = new GameFranchise();
        $franchise->fill($request->validated());
        $franchise->save();

        return redirect()->route('Admin.Game.Franchise');
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.game.franchise.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param FranchiseMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(FranchiseMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $h1NodeNames = $request->validated(['h1_node_name']);
        $keys = $request->validated(['key']);
        foreach ($nodeNames as $id => $nodeName) {
            $model = GameFranchise::find($id);
            if ($model !== null) {
                $model->node_name = $nodeName;
                $model->h1_node_name = $h1NodeNames[$id];
                $model->key = $keys[$id];
                $model->save();
            }
        }

        return redirect()->back();
    }

    /**
     * 編集画面
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function edit(GameFranchise $franchise): Application|Factory|View
    {
        return view('admin.game.franchise.edit', [
            'model' => $franchise
        ]);
    }

    /**
     * 更新処理
     *
     * @param FranchiseRequest $request
     * @param GameFranchise $franchise
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(FranchiseRequest $request, GameFranchise $franchise): RedirectResponse
    {
        $franchise->fill($request->validated());
        $franchise->save();

        return redirect()->route('Admin.Game.Franchise.Detail', $franchise);
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

        return redirect()->route('Admin.Game.Franchise');
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
        return view('admin.game.franchise.link_series', [
            'model' => $franchise,
            'linkedSeriesIds' => $franchise->series()->pluck('id')->toArray(),
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
        return redirect()->route('Admin.Game.Franchise.Detail', $franchise);
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
        return view('admin.game.franchise.link_title', [
            'model'          => $franchise,
            'linkedTitleIds' => $franchise->titles()->pluck('id')->toArray(),
            'titles'         => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param LinkMultiTitleRequest $request
     * @param GameFranchise $franchise
     * @return RedirectResponse
     */
    public function syncTitle(LinkMultiTitleRequest $request, GameFranchise $franchise): RedirectResponse
    {
        $franchise->titles()->sync($request->validated('title_id'));
        return redirect()->route('Admin.Game.Franchise.Detail', $franchise);
    }
}

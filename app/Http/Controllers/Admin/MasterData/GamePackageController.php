<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Controllers\Admin\GameFranchise;
use App\Http\Controllers\Admin\GameFranchiseRequest;
use App\Models\MasterData\GamePackage;
use App\Models\MasterData\GameSeries;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GamePackageController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        $packages = GamePackage::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $packages->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                    $query->orWhere('phonetic', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession('search_game_package', $search);

        return view('admin.game_package.index', [
            'packages' => $packages->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game_franchise.add', [
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
        $series = new GameSeries();
        $series->fill($request->validated());
        $series->save();

        return redirect()->route('Admin.MasterData.Series');
    }

    /**
     * 編集画面
     *
     * @param GameFranchise $franchise
     * @return Application|Factory|View
     */
    public function edit(GameFranchise $franchise): Application|Factory|View
    {
        return view('admin.game_franchise.edit', [
            'model' => $franchise
        ]);
    }

    /**
     * 更新処理
     *
     * @param GameFranchiseRequest $request
     * @param GameFranchise $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GameFranchiseRequest $request, GameFranchise $series): RedirectResponse
    {
        $series->fill($request->validated());
        $series->save();

        return redirect()->route('Admin.MasterData.Series');
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
        $series->delete();

        return redirect()->route('Admin.MasterData.Series');
    }
}

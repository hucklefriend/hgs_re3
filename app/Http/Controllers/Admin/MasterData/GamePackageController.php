<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\MasterData\GamePackageRequest;
use App\Models\MasterData\GamePackage;
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

        return view('admin.master_data.game_package.index', [
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
        return view('admin.master_data.game_package.add', [
            'model' => new GamePackage(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param GamePackageRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GamePackageRequest $request): RedirectResponse
    {
        $package = new GamePackage();
        $package->fill($request->validated());
        $package->save();

        return redirect()->route('Admin.MasterData.Package.Detail', $package);
    }

    /**
     * 編集画面
     *
     * @param GamePackage $package
     * @return Application|Factory|View
     */
    public function edit(GamePackage $package): Application|Factory|View
    {
        return view('admin.master_data.game_package.edit', [
            'model' => $package
        ]);
    }

    /**
     * 更新処理
     *
     * @param GamePackageRequest $request
     * @param GamePackage $package
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GamePackageRequest $request, GamePackage $package): RedirectResponse
    {
        $package->fill($request->validated());
        $package->save();

        return redirect()->route('Admin.MasterData.Package.Detail', $package);
    }

    /**
     * 削除
     *
     * @param GamePackage $series
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GamePackage $series): RedirectResponse
    {
        $series->delete();

        return redirect()->route('Admin.MasterData.Package');
    }
}

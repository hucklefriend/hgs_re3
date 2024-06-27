<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\MasterData\GamePackageMultiUpdateRequest;
use App\Http\Requests\Admin\MasterData\GamePackageRequest;
use App\Http\Requests\Admin\MasterData\GamePackageShopRequest;
use App\Models\MasterData\GamePackage;
use App\Models\MasterData\GamePackageShop;
use App\Models\MasterData\GameTitlePackageLink;
use App\Models\MasterData\GameTitleSynonym;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        return view('admin.master_data.game_package.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request)
    {
        $packages = GamePackage::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $searchPlatforms = $request->query('platform_ids', []);
        $search = ['name' => '', 'platform_ids' => []];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $packages->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });

            array_walk_synonym($words);
            $gamePackageIds = GameTitlePackageLink::whereIn('game_title_id', function ($query) use ($words) {
                $query->select('game_title_id')
                    ->from('game_title_synonyms')
                    ->whereIn('synonym', $words);
            })->get(['game_package_id'])->pluck('id')->toArray();
            if (!empty($gamePackageIds)) {
                $packages->orWhereIn('id', $gamePackageIds);
            }
        }

        if (!empty($searchPlatforms)) {
            $search['platform_ids'] = $searchPlatforms;
            $packages->orWhereIn('game_platform_id', $searchPlatforms);
        }

        $this->saveSearchSession($search);

        return [
            'packages' => $packages->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search,
        ];
    }

    /**
     * 詳細
     *
     * @param GamePackage $package
     * @return Application|Factory|View
     */
    public function detail(GamePackage $package): Application|Factory|View
    {
        return view('admin.master_data.game_package.detail', [
            'model' => $package
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
        $platformIds = $request->validated('game_platform_ids');
        $validated = $request->validated();
        unset($validated['game_platform_ids']);
        foreach ($platformIds as $platformId) {
            $validated['game_platform_id'] = $platformId;
            $package = new GamePackage();
            $package->fill($validated);
            $package->save();
        }

        return redirect()->route('Admin.MasterData.Package.Detail', $package);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.master_data.game_package.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param GamePackageMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(GamePackageMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        foreach ($nodeNames as $id => $nodeName) {
            $package = GamePackage::find($id);
            if ($package !== null) {
                $package->node_name = $nodeName;
                $package->save();
            }
        }

        return redirect()->back();
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
     * 複製画面
     *
     * @param GamePackage $package
     * @return Application|Factory|View
     */
    public function copy(GamePackage $package): Application|Factory|View
    {
        return view('admin.master_data.game_package.copy', [
            'model' => $package
        ]);
    }

    /**
     * 複製処理
     *
     * @param GamePackageRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function makeCopy(GamePackageRequest $request): RedirectResponse
    {
        $package = new GamePackage();
        $package->fill($request->validated());
        $package->save();

        return redirect()->route('Admin.MasterData.Package.Detail', $package);
    }

    /**
     * 削除
     *
     * @param GamePackage $package
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GamePackage $package): RedirectResponse
    {
        $package->delete();

        return redirect()->route('Admin.MasterData.Package');
    }

    /**
     * ショップの登録
     *
     * @param GamePackage $package
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function addShop(GamePackage $package)
    {
        return view('admin.master_data.game_package.add_shop', [
            'package' => $package,
            'model'   => new GamePackageShop(),
        ]);
    }

    /**
     * ショップの登録処理
     *
     * @param GamePackageShopRequest $request
     * @param GamePackage $package
     * @return RedirectResponse
     */
    public function storeShop(GamePackageShopRequest $request, GamePackage $package)
    {
        $shop = new GamePackageShop();
        $shop->game_package_id = $package->id;
        $shop->fill($request->validated());
        $shop->save();
        return redirect()->route('Admin.MasterData.Package.Detail', $package);
    }

    /**
     * ショップの編集
     *
     * @param GamePackage $package
     * @param $shop_id
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function editShop(GamePackage $package, $shop_id)
    {
        $shop = $package->shops()->firstWhere('shop_id', $shop_id);
        return view('admin.master_data.game_package.edit_shop', [
            'package' => $package,
            'model'   => $shop,
        ]);
    }

    /**
     * ショップの編集処理
     *
     * @param GamePackageShopRequest $request
     * @param GamePackage $package
     * @param $shop_id
     * @return RedirectResponse
     */
    public function updateShop(GamePackageShopRequest $request, GamePackage $package, $shop_id)
    {
        $shop = $package->shops()->firstWhere('shop_id', $shop_id);
        $shop->fill($request->validated());
        $shop->save();

        return redirect()->route('Admin.MasterData.Package.Detail', $package);
    }

    /**
     * ショップの削除
     *
     * @param GamePackage $package
     * @param $shop_id
     * @return RedirectResponse
     */
    public function deleteShop(GamePackage $package, $shop_id)
    {
        $package->shops()->where('shop_id', $shop_id)->delete();

        return redirect()->route('Admin.MasterData.Package.Detail', $package);
    }
}

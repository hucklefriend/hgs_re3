<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Enums\Shop;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiMakerRequest;
use App\Http\Requests\Admin\Game\LinkMultiPackageGroupRequest;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Http\Requests\Admin\Game\PackageMultiUpdateRequest;
use App\Http\Requests\Admin\Game\PackageRequest;
use App\Http\Requests\Admin\Game\PackageShopMultiUpdateRequest;
use App\Http\Requests\Admin\Game\PackageShopRequest;
use App\Models\GameMaker;
use App\Models\GamePackage;
use App\Models\GamePackageShop;
use App\Models\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PackageController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.package.index', $this->search($request));
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
            $gamePackageIds = \App\Models\GameTitlePackageLink::whereIn('game_title_id', function ($query) use ($words) {
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
        return view('admin.game.package.detail', [
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
        $linked = json_encode([
            'title_id'         => request()->query('title_id', null),
            'package_group_id' => request()->query('package_group_id', null),
        ]);

        return view('admin.game.package.add', [
            'model'  => new GamePackage(),
            'linked' => $linked,
        ]);
    }

    /**
     * 追加処理
     *
     * @param PackageRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(PackageRequest $request): RedirectResponse
    {
        $platformIds = $request->validated('game_platform_ids');
        $makerIds = $request->validated('game_maker_ids', []);
        $validated = $request->validated();
        $linked = json_decode($request->post('linked'), true);
        unset($validated['game_platform_ids']);
        unset($validated['game_maker_ids']);

        foreach ($platformIds as $platformId) {
            $validated['game_platform_id'] = $platformId;
            $package = new GamePackage();
            $package->fill($validated);
            $package->save();

            if (!empty($makerIds)) {
                $package->makers()->sync($makerIds);
            }

            if ($linked['title_id'] !== null) {
                $package->titles()->attach($linked['title_id']);
            } else if ($linked['package_group_id'] !== null) {
                $package->packageGroups()->attach($linked['package_group_id']);
            }
        }

        if ($linked['title_id'] !== null) {
            return redirect()->route('Admin.Game.Title.Detail', ['title' => $linked['title_id']]);
        } else if ($linked['package_group_id'] !== null) {
            return redirect()->route('Admin.Game.PackageGroup.Detail', ['packageGroup' => $linked['package_group_id']]);
        } else {
            return redirect()->route('Admin.Game.Package.Detail', $package);
        }
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.game.package.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param PackageMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(PackageMultiUpdateRequest $request): RedirectResponse
    {
        $ids = $request->validated('id');
        $names = $request->validated(['name']);
        $nodeNames = $request->validated(['node_name']);
        $relelaseAt = $request->validated(['release_at']);
        $sortOrder = $request->validated(['sort_order']);
        foreach ($ids as $id) {
            $package = GamePackage::find($id);
            if ($package !== null) {
                $package->name = $names[$id] ?? '';
                $package->node_name = $nodeNames[$id] ?? '';
                $package->release_at = $relelaseAt[$id] ?? '';
                $package->sort_order = $sortOrder[$id] ?? 99999999;
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
        return view('admin.game.package.edit', [
            'model' => $package
        ]);
    }

    /**
     * 更新処理
     *
     * @param PackageRequest $request
     * @param GamePackage $package
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(PackageRequest $request, GamePackage $package): RedirectResponse
    {
        $makerIds = $request->validated('game_maker_ids', []);
        $validated = $request->validated();
        unset($validated['game_maker_ids']);

        $package->fill($request->validated());
        $package->save();

        if (!empty($makerIds)) {
            $package->makers()->sync($makerIds);
        }

        foreach ($package->titles as $title) {
            $title->setFirstReleaseInt()->save();
        }
        foreach ($package->packageGroups as $packageGroup) {
            foreach ($packageGroup->packages as $pkg) {
                foreach ($pkg->titles as $title) {
                    $title->setFirstReleaseInt()->save();
                }
            }
        }

        return redirect()->route('Admin.Game.Package.Detail', $package);
    }

    /**
     * 複製画面
     *
     * @param GamePackage $package
     * @return Application|Factory|View
     */
    public function copy(GamePackage $package): Application|Factory|View
    {
        return view('admin.game.package.copy', [
            'model' => $package
        ]);
    }

    /**
     * 複製処理
     *
     * @param PackageRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function makeCopy(PackageRequest $request): RedirectResponse
    {
        $platformIds = $request->validated('game_platform_ids');
        $makerIds = $request->validated('game_maker_ids', []);
        $validated = $request->validated();
        unset($validated['game_platform_ids']);
        unset($validated['game_maker_ids']);

        $originalPackage = GamePackage::find($request->post('original_package_id'));

        foreach ($platformIds as $platformId) {
            $validated['game_platform_id'] = $platformId;
            $package = new GamePackage();
            $package->fill($validated);
            $package->save();

            if (!empty($makerIds)) {
                $package->makers()->sync($makerIds);
            }

            if ($originalPackage) {
                foreach ($originalPackage->titles as $title) {
                    $package->titles()->attach($title->id);
                }

                foreach ($originalPackage->packageGroups as $packageGroup) {
                    $package->packageGroups()->attach($packageGroup->id);
                }
            }
        }

        return redirect()->route('Admin.Game.Package.Detail', $package);
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

        return redirect()->route('Admin.Game.Package');
    }

    /**
     * ショップの登録
     *
     * @param GamePackage $package
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function addShop(GamePackage $package)
    {
        $excludeShopList = $package->shops()->pluck('shop_id')->toArray();

        return view('admin.game.package.add_shop', [
            'package'         => $package,
            'excludeShopList' => $excludeShopList,
            'model'           => new GamePackageShop(),
        ]);
    }

    /**
     * ショップの登録処理
     *
     * @param PackageShopRequest $request
     * @param GamePackage $package
     * @return RedirectResponse
     */
    public function storeShop(PackageShopRequest $request, GamePackage $package)
    {
        $shop = new GamePackageShop();
        $shop->game_package_id = $package->id;

        $shop->fill($request->validated());
        $shop->setOgpInfo($request->post('ogp_url'));
        $shop->save();

        if ($request->post('use_img_tag', 0) == 1) {
            $package->img_shop_id = $shop->id;
            $package->save();
        } else if ($package->img_shop_id === null && $shop->ogp_cache_id !== null) {
            $package->img_shop_id = $shop->id;
            $package->save();
        }

        return redirect()->route('Admin.Game.Package.Detail', $package);
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
        return view('admin.game.package.edit_shop', [
            'package' => $package,
            'model'   => $shop,
        ]);
    }

    /**
     * ショップの編集処理
     *
     * @param PackageShopRequest $request
     * @param GamePackage $package
     * @param $shop_id
     * @return RedirectResponse
     */
    public function updateShop(PackageShopRequest $request, GamePackage $package, $shop_id)
    {
        $shop = $package->shops()->firstWhere('shop_id', $shop_id);
        $shop->fill($request->validated());
        $shop->setOgpInfo($request->post('ogp_url'));
        $shop->save();

        if ($request->post('use_img_tag', 0) == 1) {
            $package->img_shop_id = $shop->id;
            $package->save();
        } else if ($package->img_shop_id === null && $shop->ogp_cache_id !== null) {
            $package->img_shop_id = $shop->id;
            $package->save();
        }

        return redirect()->route('Admin.Game.Package.Detail', $package);
    }

    /**
     * ショップの削除
     *
     * @param GamePackage $package
     * @param $shopId
     * @return RedirectResponse
     */
    public function deleteShop(GamePackage $package, $shopId)
    {
        $package->shops()->where('shop_id', $shopId)->delete();
        if ($package->img_shop_id == $shopId) {
            $package->img_shop_id = null;
            $package->save();
        }

        return redirect()->route('Admin.Game.Package.Detail', $package);
    }

    /**
     * メーカーとリンク
     *
     * @param GamePackage $package
     * @return Application|Factory|View
     */
    public function linkMaker(GamePackage $package): Application|Factory|View
    {
        $makers = GameMaker::orderBy('id')
            ->get(['id', 'name']);

        return view('admin.game.package.link_maker', [
            'model'          => $package,
            'linkedMakerIds' => $package->makers()->pluck('id')->toArray(),
            'makers'         => $makers,
        ]);
    }

    /**
     * メーカーと同期処理
     *
     * @param LinkMultiMakerRequest $request
     * @param GamePackage $package
     * @return RedirectResponse
     */
    public function syncMaker(LinkMultiMakerRequest $request, GamePackage $package): RedirectResponse
    {
        $package->makers()->sync($request->validated('game_maker_ids'));
        return redirect()->route('Admin.Game.Package.Detail', $package);
    }

    /**
     * タイトルとリンク
     *
     * @param GamePackage $package
     * @return Application|Factory|View
     */
    public function linkTitle(GamePackage $package): Application|Factory|View
    {
        $titles = GameTitle::orderBy('id')->get(['id', 'name']);
        return view('admin.game.package.link_title', [
            'model'          => $package,
            'linkedTitleIds' => $package->titles()->pluck('id')->toArray(),
            'titles'         => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param LinkMultiTitleRequest $request
     * @param GamePackage $package
     * @return RedirectResponse
     */
    public function syncTitle(LinkMultiTitleRequest $request, GamePackage $package): RedirectResponse
    {
        $package->titles()->sync($request->validated('game_title_ids'));
        foreach ($package->titles as $title) {
            $title->setFirstReleaseInt()->save();
        }
        return redirect()->route('Admin.Game.Package.Detail', $package);
    }

    /**
     * パッケージグループとリンク
     *
     * @param GamePackage $package
     * @return Application|Factory|View
     */
    public function linkPackageGroup(GamePackage $package): Application|Factory|View
    {
        return view('admin.game.package.link_package_group', [
            'model'  => $package,
            'linkedPackageGroupIds' => $package->packageGroups()->pluck('id')->toArray(),
            'packageGroups' => \App\Models\GamePackageGroup::orderBy('id')->get(['id', 'name']),
        ]);
    }

    /**
     * パッケージグループと同期処理
     *
     * @param LinkMultiPackageGroupRequest $request
     * @param GamePackage $package
     * @return RedirectResponse
     */
    public function syncPackageGroup(LinkMultiPackageGroupRequest $request, GamePackage $package): RedirectResponse
    {
        $package->packageGroups()->sync($request->validated('game_package_group_ids'));
        return redirect()->route('Admin.Game.Package.Detail', $package);
    }

    /**
     * ショップ一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editShopMulti(Request $request): Application|Factory|View
    {
        $searchShop = $request->query('shop', Shop::Amazon->value);
        $shop = Shop::tryFrom($searchShop);
        $searchName = trim($request->query('name', ''));
        $searchPlatforms = $request->query('platform_ids', []);
        $search = ['shop' => $searchShop, 'name' => '', 'platform_ids' => []];

        $packageShops = GamePackageShop::where('shop_id', $searchShop);

        if (!empty($searchName) || !empty($searchPlatforms)) {
            $packages = GamePackage::orderBy('id');

            if (!empty($searchName)) {
                $search['name'] = $searchName;
                $words = explode(' ', $searchName);

                $packages->where(function ($query) use ($words) {
                    foreach ($words as $word) {
                        $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                    }
                });
            }

            if (!empty($searchPlatforms)) {
                $search['platform_ids'] = $searchPlatforms;
                $packages->orWhereIn('game_platform_id', $searchPlatforms);
            }

            $packageShops->whereIn('game_package_id', $packages->get(['id'])->pluck('id')->toArray());
        }

        return view('admin.game.package.edit_shop_multi', [
            'packageShops' => $packageShops->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search,
            'shop' => $shop,
            'listSearch' => $this->getSearchSession(),
        ]);
    }

    /**
     * 更新処理
     *
     * @param PackageShopMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateShopMulti(PackageShopMultiUpdateRequest $request): RedirectResponse
    {
        $urls = $request->validated(['url']);
        $param1s = $request->validated(['param1']);
        foreach ($urls as $id => $url) {
            $pkgShop = GamePackageShop::find($id);
            if ($pkgShop !== null) {
                $pkgShop->url = $url;
                $pkgShop->param1 = $param1s[$id];
                $pkgShop->save();
            }
        }

        return redirect()->back();
    }
}

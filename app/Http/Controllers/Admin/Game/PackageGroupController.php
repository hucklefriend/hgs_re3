<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiPackageRequest;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Http\Requests\Admin\Game\PackageGroupRequest;
use App\Models\GamePackage;
use App\Models\GamePackageGroup;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PackageGroupController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.package_group.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request)
    {
        $packageGroups = GamePackageGroup::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => '', 'platform_ids' => []];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $packageGroups->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession($search);

        return [
            'packageGroups' => $packageGroups->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search,
        ];
    }

    /**
     * 詳細
     *
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View
     */
    public function detail(GamePackageGroup $packageGroup): Application|Factory|View
    {
        return view('admin.game.package_group.detail', [
            'model' => $packageGroup
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
            'title_id' => request()->query('title_id', null),
        ]);

        return view('admin.game.package_group.add', [
            'model' => new GamePackageGroup(),
            'linked' => $linked,
        ]);
    }

    /**
     * 追加処理
     *
     * @param PackageGroupRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(PackageGroupRequest $request): RedirectResponse
    {
        $packageGroup = new GamePackageGroup();
        $packageGroup->fill($request->validated());
        $packageGroup->save();

        $linked = json_decode($request->post('linked'), true);
        if ($linked['title_id'] !== null) {
            $packageGroup->titles()->attach($linked['title_id']);
            return redirect()->route('Admin.Game.Title.Detail', ['title' => $linked['title_id']]);
        }

        return redirect()->route('Admin.Game.PackageGroup.Detail', $packageGroup);
    }

    /**
     * 編集画面
     *
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View
     */
    public function edit(GamePackageGroup $packageGroup): Application|Factory|View
    {
        return view('admin.game.package_group.edit', [
            'model' => $packageGroup
        ]);
    }

    /**
     * 更新処理
     *
     * @param PackageGroupRequest $request
     * @param GamePackageGroup $packageGroup
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(PackageGroupRequest $request, GamePackageGroup $packageGroup): RedirectResponse
    {
        $packageGroup->fill($request->validated());
        $packageGroup->save();

        return redirect()->route('Admin.Game.PackageGroup.Detail', $packageGroup);
    }

    /**
     * 削除
     *
     * @param GamePackageGroup $packageGroup
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GamePackageGroup $packageGroup): RedirectResponse
    {
        // 紐づけを全部削除
        $packageGroup->packages()->detach();
        $packageGroup->titles()->detach();
        $packageGroup->delete();

        return redirect()->route('Admin.Game.PackageGroup');
    }

    /**
     * タイトルとリンク
     *
     * @param Request $request
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View
     */
    public function linkTitle(Request $request, GamePackageGroup $packageGroup): Application|Factory|View
    {
        $titles = \App\Models\GameTitle::orderBy('id')->get(['id', 'name']);
        return view('admin.game.package_group.link_title', [
            'model'          => $packageGroup,
            'linkedTitleIds' => $packageGroup->titles()->pluck('id')->toArray(),
            'titles'         => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param LinkMultiTitleRequest $request
     * @param GamePackageGroup $packageGroup
     * @return RedirectResponse
     */
    public function syncTitle(LinkMultiTitleRequest $request, GamePackageGroup $packageGroup): RedirectResponse
    {
        $packageGroup->titles()->sync($request->validated('game_title_ids'));
        foreach ($packageGroup->titles as $title) {
            $title->packages()->detach();
            $title->setFirstReleaseInt()->save();
        }
        return redirect()->route('Admin.Game.PackageGroup.Detail', $packageGroup);
    }

    /**
     * パッケージとリンク
     *
     * @param Request $request
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View
     */
    public function linkPackage(Request $request, GamePackageGroup $packageGroup): Application|Factory|View
    {
        $packages = GamePackage::orderBy('id')->get(['id', 'name', 'game_platform_id']);
        return view('admin.game.package_group.link_package', [
            'model'            => $packageGroup,
            'linkedPackageIds' => $packageGroup->packages()->pluck('id')->toArray(),
            'packages'         => $packages,
            'platformHash'     => \App\Models\GamePlatform::all(['id', 'acronym'])->pluck('acronym', 'id')->toArray(),
        ]);
    }

    /**
     * パッケージと同期処理
     *
     * @param LinkMultiPackageRequest $request
     * @param GamePackageGroup $packageGroup
     * @return RedirectResponse
     */
    public function syncPackage(LinkMultiPackageRequest $request, GamePackageGroup $packageGroup): RedirectResponse
    {
        $packageGroup->packages()->sync($request->validated('game_package_ids'));
        return redirect()->route('Admin.Game.PackageGroup.Detail', $packageGroup);
    }
}

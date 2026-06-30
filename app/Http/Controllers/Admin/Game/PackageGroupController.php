<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiPackageRequest;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Http\Requests\Admin\Game\PackageGroupRequest;
use App\Http\Requests\Admin\Game\PackageMultiUpdateRequest;
use App\Models\Extensions\GameTree;
use App\Models\GamePackage;
use App\Models\GamePackageGroup;
use App\Models\MasterJsonImportLog;
use App\Services\MasterJson\PackageGroupMasterJsonService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

class PackageGroupController extends AbstractAdminController
{
    public function __construct(
        private readonly PackageGroupMasterJsonService $packageGroupMasterJsonService,
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
                    $query->where('name', operator: 'LIKE', value: '%' . $word . '%');
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
            'model' => $packageGroup,
            'tree'  => GameTree::getTree($packageGroup),
        ]);
    }

    /**
     * AIに渡すJSONの出力画面
     *
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View
     */
    public function jsonExport(GamePackageGroup $packageGroup): Application|Factory|View
    {
        return view('admin.game.package_group.json_export', [
            'model' => $packageGroup,
            'json'  => json_encode($this->packageGroupMasterJsonService->export($packageGroup), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * AIが書き換えたJSONの貼り付け画面
     *
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View
     */
    public function jsonImport(GamePackageGroup $packageGroup): Application|Factory|View
    {
        return view('admin.game.package_group.json_import', [
            'model' => $packageGroup,
        ]);
    }

    /**
     * 貼り付けられたJSONと現在のデータの差分を表示
     *
     * @param Request $request
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View|RedirectResponse
     */
    public function jsonDiff(Request $request, GamePackageGroup $packageGroup): Application|Factory|View|RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $diff = $this->packageGroupMasterJsonService->diff($packageGroup, $importedJson);

        if (!empty($diff['errors'])) {
            return redirect()->route('Admin.Game.PackageGroup.JsonImport', $packageGroup)
                ->withErrors(['imported_json' => implode(' / ', $diff['errors'])])
                ->withInput();
        }

        return view('admin.game.package_group.json_diff', [
            'model'        => $packageGroup,
            'diff'         => $diff,
            'importedJson' => $importedJson,
        ]);
    }

    /**
     * 採用された差分をデータへ反映
     *
     * @param Request $request
     * @param GamePackageGroup $packageGroup
     * @return RedirectResponse
     * @throws Throwable
     */
    public function jsonApply(Request $request, GamePackageGroup $packageGroup): RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $accept = $request->input('accept', []);
        $beforeJson = json_encode($this->packageGroupMasterJsonService->export($packageGroup), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        try {
            $applied = $this->packageGroupMasterJsonService->apply($packageGroup, $importedJson, $accept);
        } catch (\Throwable $e) {
            return redirect()->route('Admin.Game.PackageGroup.JsonImport', $packageGroup)
                ->withErrors(['imported_json' => $e->getMessage()])
                ->withInput();
        }

        MasterJsonImportLog::create([
            'admin_user_id'     => Auth::guard('admin')->id(),
            'target_type'       => 'package_group',
            'target_id'         => $packageGroup->id,
            'before_json'       => $beforeJson,
            'imported_json'     => $importedJson,
            'applied_diff_json' => json_encode($applied, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

        return redirect()->route('Admin.Game.PackageGroup.Detail', $packageGroup)
            ->with('success', 'JSONの内容をデータに反映しました。');
    }

    /**
     * JSONからの新規作成画面
     *
     * @return Application|Factory|View
     */
    public function jsonNew(): Application|Factory|View
    {
        return view('admin.game.package_group.json_new', [
            'json' => json_encode($this->packageGroupMasterJsonService->template(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * JSONからの新規作成: 差分（作成内容）確認
     *
     * @param Request $request
     * @return Application|Factory|View|RedirectResponse
     */
    public function jsonNewDiff(Request $request): Application|Factory|View|RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $diff = $this->packageGroupMasterJsonService->diffNew($importedJson);

        if (!empty($diff['errors'])) {
            return redirect()->route('Admin.Game.PackageGroup.JsonNew')
                ->withErrors(['imported_json' => implode(' / ', $diff['errors'])])
                ->withInput();
        }

        return view('admin.game.package_group.json_diff_new', [
            'diff'         => $diff,
            'importedJson' => $importedJson,
        ]);
    }

    /**
     * JSONからの新規作成: 反映
     *
     * @param Request $request
     * @return RedirectResponse
     * @throws Throwable
     */
    public function jsonNewApply(Request $request): RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $accept = $request->input('accept', []);

        try {
            $result = $this->packageGroupMasterJsonService->applyNew($importedJson, $accept);
        } catch (\Throwable $e) {
            return redirect()->route('Admin.Game.PackageGroup.JsonNew')
                ->withErrors(['imported_json' => $e->getMessage()])
                ->withInput();
        }

        MasterJsonImportLog::create([
            'admin_user_id'     => Auth::guard('admin')->id(),
            'target_type'       => 'package_group',
            'target_id'         => $result['id'],
            'before_json'       => json_encode(null),
            'imported_json'     => $importedJson,
            'applied_diff_json' => json_encode($result['applied'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

        return redirect()->route('Admin.Game.PackageGroup.Detail', ['packageGroup' => $result['id']])
            ->with('success', 'JSONの内容から新規作成しました。');
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
     * @throws \Throwable
     */
    public function syncTitle(LinkMultiTitleRequest $request, GamePackageGroup $packageGroup): RedirectResponse
    {
        $packageGroup->titles()->sync($request->validated('game_title_ids'));
        foreach ($packageGroup->titles as $title) {
            $title->setFirstReleaseInt()->save();
            $series = $title->series;
            if ($series !== null) {
                $series->setTitleParam();
                $series->save();
            }
            $franchise = $title->franchise;
            if ($franchise !== null) {
                $franchise->setTitleParam();
                $franchise->save();
            }
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
        foreach ($packageGroup->titles as $title) {
            $title->setFirstReleaseInt()->save();
            $series = $title->series;
            if ($series !== null) {
                $series->setTitleParam();
                $series->save();
            }
            $franchise = $title->getFranchise();
            if ($franchise !== null) {
                $franchise->setTitleParam();
                $franchise->save();
            }
        }
        return redirect()->route('Admin.Game.PackageGroup.Detail', $packageGroup);
    }

    /**
     * パッケージ一括更新
     *
     * @param Request $request
     * @param GamePackageGroup $packageGroup
     * @return Application|Factory|View
     */
    public function editPackageMulti(Request $request, GamePackageGroup $packageGroup): Application|Factory|View
    {
        return view('admin.game.package_group.edit_package_multi', [
            'model'    => $packageGroup,
            'packages' => $packageGroup->packages()->orderBy('id')->get(),
        ]);
    }

    /**
     * パッケージ更新処理
     *
     * @param PackageMultiUpdateRequest $request
     * @param GamePackageGroup $packageGroup
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updatePackageMulti(PackageMultiUpdateRequest $request, GamePackageGroup $packageGroup): RedirectResponse
    {
        $ids = $request->validated('id');
        $names = $request->validated(['name']);
        $nodeNames = $request->validated(['node_name']);
        $relelaseAt = $request->validated(['release_at']);
        $sortOrder = $request->validated(['sort_order']);
        $rating = $request->validated(['rating']);
        foreach ($ids as $id) {
            $package = GamePackage::find($id);
            if ($package !== null) {
                $package->name = $names[$id] ?? '';
                $package->node_name = $nodeNames[$id] ?? '';
                $package->release_at = $relelaseAt[$id] ?? '';
                $package->sort_order = $sortOrder[$id] ?? 99999999;
                $package->rating = $rating[$id] ?? $package->rating;
                $package->save();
            }
        }

        foreach ($packageGroup->titles as $title) {
            $franchise = $title->getFranchise();
            $franchise->setTitleParam()->save();
            $series = $title->series;
            if ($series !== null) {
                $series->setTitleParam();
                $series->save();
            }
        }

        return redirect()->route('Admin.Game.PackageGroup.Detail', $packageGroup);
    }
}

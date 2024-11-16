<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiMediaMixRequest;
use App\Http\Requests\Admin\Game\LinkMultiPackageGroupRequest;
use App\Http\Requests\Admin\Game\LinkMultiPackageRequest;
use App\Http\Requests\Admin\Game\LinkMultiRelatedProductRequest;
use App\Http\Requests\Admin\Game\PackageMultiUpdateRequest;
use App\Http\Requests\Admin\Game\TitleMultiPackageGroupUpdateRequest;
use App\Http\Requests\Admin\Game\TitleMultiPackageUpdateRequest;
use App\Http\Requests\Admin\Game\TitleMultiUpdateRequest;
use App\Http\Requests\Admin\Game\TitleRequest;
use App\Models\Extensions\GameTree;
use App\Models\GameMediaMix;
use App\Models\GamePackage;
use App\Models\GamePackageGroup;
use App\Models\GameTitle;
use App\Models\OgpCache;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Throwable;

class TitleController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.title.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $titles = GameTitle::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $titles->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                    $query->orWhere('phonetic', operator: 'LIKE', value: '%' . $word . '%');
                }
            });

            // 俗称も探す
            // $words配列の中にある文字列にsynonym関数を適用する
            array_walk($words, function ($value, $key){
                return synonym($value);
            });

            // サブクエリで、game_maker_synonymsテーブルのsynonymが一致するgame_maker_id
            $titles->orWhereIn('id', function ($query) use ($words) {
                $query->select('game_title_id')
                    ->from('game_title_synonyms')
                    ->whereIn('synonym', $words);
            });
        }

        $this->saveSearchSession($search);

        return [
            'titles' => $titles->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ];
    }

    /**
     * 詳細
     *
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function detail(GameTitle $title): Application|Factory|View
    {
        $title->loadSynonyms();
        return view('admin.game.title.detail', [
            'model' => $title,
            'tree'  => GameTree::getTree($title),
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game.title.add', [
            'model' => new GameTitle(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param TitleRequest $request
     * @return RedirectResponse
     * @throws Throwable
     */
    public function store(TitleRequest $request): RedirectResponse
    {
        $title = new GameTitle();
        $title->fill($request->validated());
        $title->synonymsStr = $request->post('synonymsStr', '');
        $title->setOgpInfo($request->post('ogp_url'));
        $title->save();

        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.game.title.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param TitleMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws Throwable
     */
    public function updateMulti(TitleMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $h1NodeNames = $request->validated(['h1_node_name']);
        $keys = $request->validated(['key']);
        foreach ($nodeNames as $id => $nodeName) {
            $model = GameTitle::find($id);
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
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function edit(GameTitle $title): Application|Factory|View
    {
        $title->loadSynonyms();
        return view('admin.game.title.edit', [
            'model' => $title
        ]);
    }

    /**
     * 更新処理
     *
     * @param TitleRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     * @throws Throwable
     */
    public function update(TitleRequest $request, GameTitle $title): RedirectResponse
    {
        $title->fill($request->validated());
        $title->synonymsStr = $request->post('synonymsStr', '');
        $title->setOgpInfo($request->post('ogp_url'));
        $title->save();

        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * 削除
     *
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function delete(GameTitle $title): RedirectResponse
    {
        $title->packages()->detach();
        $title->packageGroups()->detach();
        $title->synonyms()->delete();
        $title->relatedProducts()->detach();
        $title->delete();

        return redirect()->route('Admin.Game.Title');
    }

    /**
     * パッケージグループとリンク
     *
     * @param Request $request
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function linkPackageGroup(Request $request, GameTitle $title): Application|Factory|View
    {
        $packageGroups = \App\Models\GamePackageGroup::orderBy('id')->get(['id', 'name']);
        return view('admin.game.title.link_package_groups', [
            'model'                 => $title,
            'linkedPackageGroupIds' => $title->packageGroups()->pluck('id')->toArray(),
            'packageGroups'         => $packageGroups,
        ]);
    }

    /**
     * パッケージグループと同期処理
     *
     * @param LinkMultiPackageGroupRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     * @throws Throwable
     */
    public function syncPackageGroup(LinkMultiPackageGroupRequest $request, GameTitle $title): RedirectResponse
    {
        $title->packageGroups()->sync($request->validated('game_package_group_ids'));
        $title->packages()->detach();
        $title->setFirstReleaseInt()->save();
        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * 関連パッケージの一括更新
     *
     * @param Request $request
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function editPackageGroupMulti(Request $request, GameTitle $title): Application|Factory|View
    {
        $packages = [];
        if ($title->packages->isEmpty()) {
            foreach ($title->packageGroups as $pg) {
                foreach ($pg->packages as $package) {
                    $packages[] = $package;
                }
            }
        } else {
            $packages = $title->packages;
        }
        return view('admin.game.title.edit_package_group_multi', compact('packages', 'title'));
    }

    /**
     * 関連パッケージの更新処理
     *
     * @param TitleMultiPackageGroupUpdateRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     * @throws Throwable
     */
    public function updatePackageGroupMulti(TitleMultiPackageGroupUpdateRequest $request, GameTitle $title): RedirectResponse
    {
        $ids = $request->validated('id');
        $names = $request->validated(['name']);
        $nodeNames = $request->validated(['node_name']);
        $sortOrder = $request->validated(['sort_order']);
        foreach ($ids as $id) {
            $pkgGroup = GamePackageGroup::find($id);
            if ($pkgGroup !== null) {
                $pkgGroup->name = $names[$id] ?? '';
                $pkgGroup->node_name = $nodeNames[$id] ?? '';
                $pkgGroup->sort_order = $sortOrder[$id] ?? 99999999;
                $pkgGroup->save();
            }
        }

        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * パッケージとリンク
     *
     * @param Request $request
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function linkPackage(Request $request, GameTitle $title): Application|Factory|View
    {
        $packages = \App\Models\GamePackage::orderBy('id')->get(['id', 'name', 'game_platform_id']);
        return view('admin.game.title.link_packages', [
            'model'            => $title,
            'linkedPackageIds' => $title->packages()->pluck('id')->toArray(),
            'packages'         => $packages,
            'platformHash'     => \App\Models\GamePlatform::all(['id', 'acronym'])->pluck('acronym', 'id')->toArray(),
        ]);
    }

    /**
     * パッケージと同期処理
     *
     * @param LinkMultiPackageRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     * @throws Throwable
     */
    public function syncPackage(LinkMultiPackageRequest $request, GameTitle $title): RedirectResponse
    {
        $title->packages()->sync($request->validated('game_package_ids'));
        $title->packageGroups()->detach();
        $title->setFirstReleaseInt()->save();
        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * 関連パッケージの一括更新
     *
     * @param Request $request
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function editPackageMulti(Request $request, GameTitle $title): Application|Factory|View
    {
        $packages = [];
        if ($title->packages->isEmpty()) {
            foreach ($title->packageGroups as $pg) {
                foreach ($pg->packages as $package) {
                    $packages[] = $package;
                }
            }
        } else {
            $packages = $title->packages;
        }
        return view('admin.game.title.edit_package_multi', compact('packages', 'title'));
    }

    /**
     * 関連パッケージの更新処理
     *
     * @param PackageMultiUpdateRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     * @throws Throwable
     */
    public function updatePackageMulti(PackageMultiUpdateRequest $request, GameTitle $title): RedirectResponse
    {
        $ids = $request->validated('id');
        $names = $request->validated(['name']);
        $nodeNames = $request->validated(['node_name']);
        $releaseAt = $request->validated(['release_at']);
        $sortOrder = $request->validated(['sort_order']);
        $rating = $request->validated(['rating']);
        foreach ($ids as $id) {
            $package = GamePackage::find($id);
            if ($package !== null) {
                $package->name = $names[$id] ?? '';
                $package->node_name = $nodeNames[$id] ?? '';
                $package->release_at = $releaseAt[$id] ?? '';
                $package->sort_order = $sortOrder[$id] ?? 99999999;
                $package->rating = $rating[$id] ?? $package->rating;
                $package->save();
            }
        }

        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * 関連商品とリンク
     *
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function linkRelatedProduct(GameTitle $title): Application|Factory|View
    {
        $relatedProducts = \App\Models\GameRelatedProduct::orderBy('id')->get(['id', 'name']);
        return view('admin.game.media_mix.link_related_product', [
            'model' => $title,
            'linkedRelatedProductIds' => $title->relatedProducts()->pluck('id')->toArray(),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * 関連商品と同期処理
     *
     * @param LinkMultiRelatedProductRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function syncRelatedProduct(LinkMultiRelatedProductRequest $request, GameTitle $title): RedirectResponse
    {
        $title->relatedProducts()->sync($request->validated('game_related_product_ids'));
        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * メディアミックスとリンク
     *
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function linkMediaMix(GameTitle $title): Application|Factory|View
    {
        return view('admin.game.title.link_media_mix', [
            'model' => $title,
            'linkedMediaMixIds' => $title->mediaMixes()->pluck('id')->toArray(),
            'mediaMixes' => GameMediaMix::orderBy('id')->get(['id', 'name']),
        ]);
    }

    /**
     * メディアミックスと同期処理
     *
     * @param LinkMultiMediaMixRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function syncMediaMix(LinkMultiMediaMixRequest $request, GameTitle $title): RedirectResponse
    {
        $title->mediaMixes()->sync($request->validated('game_media_mix_ids'));
        return redirect()->route('Admin.Game.Title.Detail', $title);
    }
}

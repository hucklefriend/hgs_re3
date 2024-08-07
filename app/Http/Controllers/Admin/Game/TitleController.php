<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\GameTitleFranchiseLinkRequest;
use App\Http\Requests\Admin\Game\GameTitleMultiPackageUpdateRequest;
use App\Http\Requests\Admin\Game\GameTitleMultiUpdateRequest;
use App\Http\Requests\Admin\Game\GameTitleRequest;
use App\Http\Requests\Admin\Game\GameTitleSeriesLinkRequest;
use App\Http\Requests\Admin\Game\LinkMultiPackageGroupRequest;
use App\Http\Requests\Admin\Game\LinkMultiPackageRequest;
use App\Models\Game\GameFranchise;
use App\Models\Game\GameFranchiseTitleLink;
use App\Models\Game\GamePackage;
use App\Models\Game\GamePackageGroup;
use App\Models\Game\GamePlatform;
use App\Models\Game\GameSeries;
use App\Models\Game\GameSeriesTitleLink;
use App\Models\Game\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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
            'model' => $title
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
     * @param GameTitleRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GameTitleRequest $request): RedirectResponse
    {
        $title = new GameTitle();
        $title->fill($request->validated());
        $title->synonymsStr = $request->post('synonymsStr', '');
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
     * @param GameTitleMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(GameTitleMultiUpdateRequest $request): RedirectResponse
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
     * @param GameTitleRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GameTitleRequest $request, GameTitle $title): RedirectResponse
    {
        $title->fill($request->validated());
        $title->synonymsStr = $request->post('synonymsStr', '');
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
        GameSeriesTitleLink::where('game_title_id', $title->id)->delete();
        GameFranchiseTitleLink::where('game_title_id', $title->id)->delete();
        $title->delete();

        return redirect()->route('Admin.Game.Title');
    }

    /**
     * フランチャイズとリンク
     *
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function linkFranchise(GameTitle $title): Application|Factory|View
    {
        $franchises = GameFranchise::orderBy('id')->get(['id', 'name']);
        return view('admin.game.title.link_franchise', [
            'model' => $title,
            'franchises' => $franchises,
        ]);
    }

    /**
     * フランチャイズと同期処理
     *
     * @param GameTitleFranchiseLinkRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function syncFranchise(GameTitleFranchiseLinkRequest $request, GameTitle $title): RedirectResponse
    {
        if ($title->franchise()) {
            $title->franchise()->titles()->detach($title->id);
        }

        $franchise = GameFranchise::find($request->validated('franchise_id'));
        $franchise->titles()->attach($title->id);

        return redirect()->route('Admin.Game.Title.Detail', $title);
    }

    /**
     * シリーズとリンク
     *
     * @param GameTitle $title
     * @return Application|Factory|View
     */
    public function linkSeries(GameTitle $title): Application|Factory|View
    {
        $series = ['' => 'シリーズに属さない'] + GameSeries::orderBy('id')
                ->get(['id', 'name'])->pluck('name', 'id')->toArray();
        return view('admin.game.title.link_series', [
            'model'  => $title,
            'series' => $series,
        ]);
    }

    /**
     * シリーズと同期処理
     *
     * @param GameTitleSeriesLinkRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function syncSeries(GameTitleSeriesLinkRequest $request, GameTitle $title): RedirectResponse
    {
        if ($title->series()) {
            $title->series()->titles()->detach($title->id);
        }

        if (!empty($request->validated('series_id'))) {
            $series = GameSeries::find($request->validated('series_id'));
            $series->titles()->attach($title->id);
        }

        return redirect()->route('Admin.Game.Title.Detail', $title);
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
        $packageGroups = GamePackageGroup::orderBy('id')->get(['id', 'name']);
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
     */
    public function syncPackageGroup(LinkMultiPackageGroupRequest $request, GameTitle $title): RedirectResponse
    {
        $title->packageGroups()->sync($request->validated('package_group_id'));
        $title->packages()->detach();
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
        $packages = GamePackage::orderBy('id')->get(['id', 'name', 'game_platform_id']);
        return view('admin.game.title.link_packages', [
            'model'            => $title,
            'linkedPackageIds' => $title->packages()->pluck('id')->toArray(),
            'packages'         => $packages,
            'platformHash'     => GamePlatform::all(['id', 'acronym'])->pluck('acronym', 'id')->toArray(),
        ]);
    }

    /**
     * パッケージと同期処理
     *
     * @param LinkMultiPackageRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function syncPackage(LinkMultiPackageRequest $request, GameTitle $title): RedirectResponse
    {
        $title->packages()->sync($request->validated('package_id'));
        $title->packageGroups()->detach();
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
     * @param GameTitleMultiPackageUpdateRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updatePackageMulti(GameTitleMultiPackageUpdateRequest $request, GameTitle $title): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $acronyms = $request->validated(['acronym']);
        foreach ($nodeNames as $id => $nodeName) {
            $model = GamePackage::find($id);
            if ($model !== null) {
                $model->node_name = $nodeName;
                $model->acronym = $acronyms[$id];
                $model->save();
            }
        }

        return redirect()->back();
    }
}

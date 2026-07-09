<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiPackageRequest;
use App\Http\Requests\Admin\Game\MakerMultiUpdateRequest;
use App\Http\Requests\Admin\Game\MakerRequest;
use App\Models\GameMaker;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MakerController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.maker.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $makers = GameMaker::orderByDesc('id');
        $searchName = trim($request->query('name', ''));
        $search = [];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $makers->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->where('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });

            // 俗称も探す
            $synonymWords = [];
            foreach ($words as $word) {
                $synonymWords[] = synonym($word);
            }

            // search_synonymsカラム内の改行区切り文字列から検索
            if (!empty($synonymWords)) {
                $makers->orWhere(function ($query) use ($synonymWords) {
                    foreach ($synonymWords as $synonymWord) {
                        $query->orWhere('search_synonyms', 'LIKE', '%' . $synonymWord . '%');
                    }
                });
            }
        }

        $this->saveSearchSession($search);

        return [
            'search' => $search,
            'makers' => $makers->paginate(AdminDefine::ITEMS_PER_PAGE)
        ];
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game.maker.add', [
            'model'  => new GameMaker(),
            'search' => $this->getSearchSession()
        ]);
    }

    /**
     * 追加処理
     *
     * @param MakerRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(MakerRequest $request): RedirectResponse
    {
        $maker = new GameMaker();
        $maker->fill($request->validated());
        $maker->save();

        return redirect()->route('Admin.Game.Maker.Detail', $maker);
    }

    /**
     * 詳細
     *
     * @param GameMaker $maker
     * @return Application|Factory|View
     */
    public function detail(GameMaker $maker): Application|Factory|View
    {
        return view('admin.game.maker.detail', [
            'model'  => $maker,
            'search' => $this->getSearchSession()
        ]);
    }

    /**
     * 編集画面
     *
     * @param GameMaker $maker
     * @return Application|Factory|View
     */
    public function edit(GameMaker $maker): Application|Factory|View
    {
        return view('admin.game.maker.edit', [
            'model' => $maker
        ]);
    }

    /**
     * データ更新
     *
     * @param MakerRequest $request
     * @param \App\Models\GameMaker $maker
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(MakerRequest $request, GameMaker $maker): RedirectResponse
    {
        $maker->fill($request->validated());
        $maker->save();

        return redirect()->route('Admin.Game.Maker.Detail', $maker);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.game.maker.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param MakerMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(MakerMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $keys = $request->validated(['key']);
        $types = $request->validated(['type']);
        foreach ($nodeNames as $id => $nodeName) {
            $model = GameMaker::find($id);
            if ($model !== null) {
                $model->node_name = $nodeName;
                $model->key = $keys[$id];
                $model->type = $types[$id];
                $model->save();
            }
        }

        return redirect()->back();
    }

    /**
     * 削除
     *
     * @param GameMaker $maker
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GameMaker $maker): RedirectResponse
    {
        $maker->delete();

        return redirect()->route('Admin.Game.Maker');
    }

    /**
     * パッケージとリンク
     *
     * @param GameMaker $maker
     * @return Application|Factory|View
     */
    public function linkPackage(GameMaker $maker): Application|Factory|View
    {
        $packages = \App\Models\GamePackage::orderBy('id')->get(['id', 'name', 'game_platform_id']);
        return view('admin.game.maker.link_package', [
            'model'            => $maker,
            'linkedPackageIds' => $maker->packages()->pluck('id')->toArray(),
            'packages'         => $packages,
            'platformHash'     => \App\Models\GamePlatform::all(['id', 'acronym'])->pluck('acronym', 'id')->toArray(),
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param LinkMultiPackageRequest $request
     * @param GameMaker $maker
     * @return RedirectResponse
     */
    public function syncTitle(LinkMultiPackageRequest $request, GameMaker $maker): RedirectResponse
    {
        $maker->packages()->sync($request->validated('game_package_ids'));
        return redirect()->route('Admin.Game.Maker.Detail', $maker);
    }
}

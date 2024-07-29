<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\MasterData\GameMakerMultiUpdateRequest;
use App\Http\Requests\Admin\MasterData\GameMakerPackageLinkRequest;
use App\Http\Requests\Admin\MasterData\GameMakerRequest;
use App\Models\MasterData\GameMaker;
use App\Models\MasterData\GamePackage;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class GameMakerController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.master_data.game_maker.index', $this->search($request));
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
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });

            // 俗称も探す
            // $words配列の中にある文字列にsynonym関数を適用する
            array_walk($words, function ($value, $key){
                return synonym($value);
            });

            // サブクエリで、game_maker_synonymsテーブルのsynonymが一致するgame_maker_id
            $makers->orWhereIn('id', function ($query) use ($words) {
                $query->select('game_maker_id')
                    ->from('game_maker_synonyms')
                    ->whereIn('synonym', $words);
            });
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
        return view('admin.master_data.game_maker.add', [
            'model'  => new GameMaker(),
            'search' => $this->getSearchSession()
        ]);
    }

    /**
     * 追加処理
     *
     * @param GameMakerRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GameMakerRequest $request): RedirectResponse
    {
        $maker = new GameMaker();
        $maker->fill($request->validated());
        $maker->synonymsStr = $request->post('synonymsStr', '');
        $maker->save();

        return redirect()->route('Admin.MasterData.Maker.Detail', $maker);
    }

    /**
     * 詳細
     *
     * @param GameMaker $maker
     * @return Application|Factory|View
     */
    public function detail(GameMaker $maker): Application|Factory|View
    {
        $maker->loadSynonyms();
        return view('admin.master_data.game_maker.detail', [
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
        $maker->loadSynonyms();
        return view('admin.master_data.game_maker.edit', [
            'model' => $maker
        ]);
    }

    /**
     * データ更新
     *
     * @param GameMakerRequest $request
     * @param GameMaker $maker
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GameMakerRequest $request, GameMaker $maker): RedirectResponse
    {
        $maker->fill($request->validated());
        $maker->synonymsStr = $request->validated('synonymsStr', '');
        $maker->save();

        return redirect()->route('Admin.MasterData.Maker.Detail', $maker);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.master_data.game_maker.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param GameMakerMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(GameMakerMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $h1NodeNames = $request->validated(['h1_node_name']);
        $keys = $request->validated(['key']);
        foreach ($nodeNames as $id => $nodeName) {
            $model = GameMaker::find($id);
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
     * 削除
     *
     * @param GameMaker $maker
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GameMaker $maker): RedirectResponse
    {
        $maker->delete();

        return redirect()->route('Admin.MasterData.Maker');
    }

    /**
     * パッケージとリンク
     *
     * @param GameMaker $maker
     * @return Application|Factory|View
     */
    public function linkTitle(GameMaker $maker): Application|Factory|View
    {
        $packages = GamePackage::orderBy('id')
            ->whereNotIn('id', function ($query){
                $query->select('game_title_id')
                    ->from('game_series_title_links');
            })
            ->get(['id', 'name']);

        return view('admin.master_data.game_maker.link_package', [
            'model'            => $maker,
            'linkedPackageIds' => $maker->packages()->pluck('id')->toArray(),
            'packages'         => $packages,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param GameMakerPackageLinkRequest $request
     * @param GameMaker $maker
     * @return RedirectResponse
     */
    public function syncTitle(GameMakerPackageLinkRequest $request, GameMaker $maker): RedirectResponse
    {
        $maker->packages()->sync($request->validated('package_id'));
        return redirect()->route('Admin.MasterData.Maker.Detail', $maker);
    }
}

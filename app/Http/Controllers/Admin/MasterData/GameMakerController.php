<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Requests\Admin\MasterData\GameMakerMultiUpdateRequest;
use App\Http\Requests\Admin\MasterData\GameMakerRequest;
use App\Models\MasterData\GameMaker;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GameMakerController extends AbstractMasterDataController
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
                    $query->orWhere('phonetic', operator: 'LIKE', value: '%' . $word . '%');
                    $query->orWhere('acronym', operator: 'LIKE', value: '%' . $word . '%');
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
            'model' => new GameMaker(),
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

        return redirect()->route('Admin.MasterData.Maker');
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

        return redirect()->route('Admin.MasterData.Maker');
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
        foreach ($nodeNames as $id => $nodeName) {
            $maker = GameMaker::find($id);
            if ($maker !== null) {
                $maker->node_name = $nodeName;
                $maker->h1_node_name = $h1NodeNames[$id];
                $maker->save();
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
}

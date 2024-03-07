<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Models\MasterData\GameMaker;
use App\Http\Requests\Admin\MasterData\GameMakerRequest;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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
        $makers = GameMaker::orderByDesc('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

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

        $this->saveSearchSession('search_game_maker', $search);

        return view('admin.master_data.game_maker.index', [
            'search' => $search,
            'makers' => $makers->paginate(AdminDefine::ITEMS_PER_PAGE)
        ]);
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

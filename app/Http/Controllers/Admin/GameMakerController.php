<?php
/**
 * [管理]メーカー
 */

namespace App\Http\Controllers\Admin;

use App\Defines\AdminDefine;
use App\Http\Requests\Admin\GameMakerRequest;
use App\Models\MasterData\GameMaker;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $makers = GameMaker::orderBy('id');

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
        }

        $this->saveSearchSession('search_maker', $search);

        return view('admin.game_maker.index', [
            'search' => $search,
            'makers' => $makers->paginate(AdminDefine::ITEMS_PER_PAGE)
        ]);
    }

    /**
     * 詳細
     *
     * @param GameMaker $maker
     * @return Application|Factory|View
     */
    public function detail(GameMaker $maker): Application|Factory|View
    {
        return view('admin.game_maker.detail', [
            'model' => $maker
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game_maker.add', [
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

        return redirect()->route('Admin>MasterData>Maker');
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
        return view('admin.game_maker.edit', [
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

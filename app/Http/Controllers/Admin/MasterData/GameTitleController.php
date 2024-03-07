<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\MasterData\GameSeriesFranchiseLinkRequest;
use App\Http\Requests\Admin\MasterData\GameTitleRequest;
use App\Models\MasterData\GameFranchise;
use App\Models\MasterData\GameSeries;
use App\Models\MasterData\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GameTitleController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
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

        $this->saveSearchSession('search_game_title', $search);

        return view('admin.master_data.game_title.index', [
            'titles' => $titles->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ]);
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
        return view('admin.master_data.game_title.detail', [
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
        return view('admin.master_data.game_title.add', [
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

        return redirect()->route('Admin.MasterData.Title.Detail', $title);
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
        return view('admin.master_data.game_title.edit', [
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

        return redirect()->route('Admin.MasterData.Title.Detail', $title);
    }

    /**
     * 削除
     *
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function delete(GameTitle $title): RedirectResponse
    {
        $title->delete();

        return redirect()->route('Admin.MasterData.Title');
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
        return view('admin.master_data.game_title.link_franchise', [
            'model' => $title,
            'franchises' => $franchises,
        ]);
    }

    /**
     * フランチャイズと同期処理
     *
     * @param GameSeriesFranchiseLinkRequest $request
     * @param GameTitle $title
     * @return RedirectResponse
     */
    public function syncFranchise(GameSeriesFranchiseLinkRequest $request, GameTitle $title): RedirectResponse
    {
        if ($title->franchise()) {
            $title->franchise()->titles()->detach($title->id);
        }

        $franchise = GameFranchise::find($request->validated('franchise_id'));
        $franchise->series()->attach($title->id);

        return redirect()->route('Admin.MasterData.Title.Detail', $title);
    }
}

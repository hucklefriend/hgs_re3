<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Models\MasterData\GamePlatform;
use App\Http\Requests\Admin\MasterData\GamePlatformRequest;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GamePlatformController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        $platforms = GamePlatform::orderByDesc('id')
            ->paginate(AdminDefine::ITEMS_PER_PAGE);

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $platforms->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                    $query->orWhere('acronym', operator: 'LIKE', value: '%' . $word . '%');
                }
            });

            // 俗称も探す
            // $words配列の中にある文字列にsynonym関数を適用する
            array_walk($words, function (&$value, $key){
                $value = synonym($value);
            });

            // サブクエリで、game_maker_synonymsテーブルのsynonymが一致するgame_maker_id
            $platforms->orWhereIn('id', function ($query) use ($words) {
                $query->select('game_platform_id')
                    ->from('game_platform_synonyms')
                    ->whereIn('synonym', $words);
            });
        }

        $this->saveSearchSession('search_game_platform', $search);

        return view('admin.master_data.game_platform.index', [
            'platforms' => $platforms,
            'search' => $search,
        ]);
    }

    /**
     * 詳細
     *
     * @param GamePlatform $platform
     * @return Application|Factory|View
     */
    public function detail(GamePlatform $platform): Application|Factory|View
    {
        $platform->loadSynonyms();
        return view('admin.master_data.game_platform.detail', [
            'model' => $platform
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.master_data.game_platform.add', [
            'model'  => new GamePlatform()
        ]);
    }

    /**
     * 追加処理
     *
     * @param GamePlatformRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GamePlatformRequest $request): RedirectResponse
    {
        $platform = new GamePlatform();
        $platform->fill($request->validated());
        $platform->synonymsStr = $request->post('synonymsStr', '');
        $platform->save();

        return redirect()->route('Admin.MasterData.Platform.Detail', $platform);
    }

    /**
     * 編集画面
     *
     * @param GamePlatform $platform
     * @return Application|Factory|View
     */
    public function edit(GamePlatform $platform): Application|Factory|View
    {
        $platform->loadSynonyms();
        return view('admin.master_data.game_platform.edit', [
            'model'  => $platform
        ]);
    }

    /**
     * データ更新
     *
     * @param GamePlatformRequest $request
     * @param GamePlatform $platform
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GamePlatformRequest $request, GamePlatform $platform): RedirectResponse
    {
        $platform->fill($request->validated());
        $platform->synonymsStr = $request->post('synonymsStr', '');
        $platform->save();

        return redirect()->route('Admin.MasterData.Platform.Detail', $platform);
    }

    /**
     * 削除
     *
     * @param GamePlatform $platform
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GamePlatform $platform): RedirectResponse
    {
        $platform->delete();

        return redirect()->route('Admin.MasterData.Platform');
    }
}

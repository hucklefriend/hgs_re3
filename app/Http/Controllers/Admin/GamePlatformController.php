<?php

namespace App\Http\Controllers\Admin;

use App\Defines\AdminDefine;
use App\Http\Controllers\Controller;
use App\Models\MasterData\GamePlatform;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller as BaseController;

class GamePlatformController extends Controller
{

    /**
     * インデックス
     *
     * @return Application|Factory|View
     */
    public function index(): Application|Factory|View
    {
        $platforms = GamePlatform::orderByDesc('id')
            ->paginate(AdminDefine::ITEMS_PER_PAGE);

        return view('management.master.platform.index', [
            'platforms' => $platforms
        ]);
    }


    /**
     * 詳細
     *
     * @param Orm\GamePlatform $platform
     * @return Application|Factory|View
     */
    public function detail(Orm\GamePlatform $platform): Application|Factory|View
    {
        return view('management.master.platform.detail', [
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
        return view('management.master.platform.add', [
            'model'  => new Orm\GamePlatform(),
            'makers' => Orm\GameMaker::getHashBy('name', prepend: ['' => '-'])
        ]);
    }

    /**
     * 追加処理
     *
     * @param GamePlatformRequest $request
     * @return RedirectResponse
     */
    public function store(GamePlatformRequest $request): RedirectResponse
    {
        $platform = new Orm\GamePlatform();
        $platform->fill($request->validated());
        $platform->save();

        return redirect()->route('管理-マスター-プラットフォーム詳細', $platform);
    }

    /**
     * 編集画面
     *
     * @param Orm\GamePlatform $platform
     * @return Application|Factory|View
     */
    public function edit(Orm\GamePlatform $platform): Application|Factory|View
    {
        $makers = Orm\GameMaker::getHashBy('name', prepend: ['' => '-']);

        return view('management.master.platform.edit', [
            'model'  => $platform,
            'makers' => $makers
        ]);
    }

    /**
     * データ更新
     *
     * @param GamePlatformRequest $request
     * @param Orm\GamePlatform $platform
     * @return RedirectResponse
     */
    public function update(GamePlatformRequest $request, Orm\GamePlatform $platform): RedirectResponse
    {
        $platform->fill($request->validated());
        $platform->save();

        return redirect()->route('管理-マスター-プラットフォーム詳細', $platform);
    }

    /**
     * 削除
     *
     * @param Orm\GamePlatform $platform
     * @return RedirectResponse
     */
    public function delete(Orm\GamePlatform $platform): RedirectResponse
    {
        $platform->delete();

        return redirect()->route('管理-マスター-プラットフォーム');
    }
}

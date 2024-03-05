<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Models\MasterData\GamePlatform;
use GamePlatformRequest;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;

class GamePlatformController extends AbstractAdminController
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

        return view('admin.game_platform.index', [
            'platforms' => $platforms
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
        return view('admin.game_platform.detail', [
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
        return view('admin.game_platform.add', [
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
        return view('admin.game_platform.edit', [
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

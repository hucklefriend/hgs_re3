<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiMediaMixRequest;
use App\Http\Requests\Admin\Game\MediaMixGroupRequest;
use App\Models\Extensions\GameTree;
use App\Models\GameMediaMix;
use App\Models\GameMediaMixGroup;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MediaMixGroupController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.media_mix_group.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request)
    {
        $mediaMixGroups = \App\Models\GameMediaMixGroup::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => '', 'platform_ids' => []];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $mediaMixGroups->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession($search);

        return [
            'mediaMixGroups' => $mediaMixGroups->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search,
        ];
    }

    /**
     * 詳細
     *
     * @param \App\Models\GameMediaMixGroup $mediaMixGroup
     * @return Application|Factory|View
     */
    public function detail(GameMediaMixGroup $mediaMixGroup): Application|Factory|View
    {
        return view('admin.game.media_mix_group.detail', [
            'model' => $mediaMixGroup,
            'tree'  => GameTree::getTree($mediaMixGroup),
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game.media_mix_group.add', [
            'model' => new \App\Models\GameMediaMixGroup(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param MediaMixGroupRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(MediaMixGroupRequest $request): RedirectResponse
    {
        $mediaMixGroup = new \App\Models\GameMediaMixGroup();
        $mediaMixGroup->fill($request->validated());
        $mediaMixGroup->save();

        return redirect()->route('Admin.Game.MediaMixGroup.Detail', $mediaMixGroup);
    }

    /**
     * 編集画面
     *
     * @param \App\Models\GameMediaMixGroup $mediaMixGroup
     * @return Application|Factory|View
     */
    public function edit(GameMediaMixGroup $mediaMixGroup): Application|Factory|View
    {
        return view('admin.game.media_mix_group.edit', [
            'model' => $mediaMixGroup
        ]);
    }

    /**
     * 更新処理
     *
     * @param MediaMixGroupRequest $request
     * @param GameMediaMixGroup $mediaMixGroup
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(MediaMixGroupRequest $request, GameMediaMixGroup $mediaMixGroup): RedirectResponse
    {
        $mediaMixGroup->fill($request->validated());
        $mediaMixGroup->save();

        return redirect()->route('Admin.Game.MediaMixGroup.Detail', $mediaMixGroup);
    }

    /**
     * 削除
     *
     * @param \App\Models\GameMediaMixGroup $mediaMixGroup
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(\App\Models\GameMediaMixGroup $mediaMixGroup): RedirectResponse
    {
        // 紐づけを全部削除
        foreach ($mediaMixGroup->mediaMixes as $mm) {
            $mm->game_media_mix_group_id = null;
            $mm->save();
        }
        $mediaMixGroup->delete();

        return redirect()->route('Admin.Game.MediaMixGroup');
    }

    /**
     * メディアミックスとリンク
     *
     * @param Request $request
     * @param \App\Models\GameMediaMixGroup $mediaMixGroup
     * @return Application|Factory|View
     */
    public function linkMediaMix(Request $request, GameMediaMixGroup $mediaMixGroup): Application|Factory|View
    {
        return view('admin.game.media_mix_group.link_media_mix', [
            'model'             => $mediaMixGroup,
            'linkedMediaMixIds' => $mediaMixGroup->mediaMixes()->pluck('id')->toArray(),
            'mediaMixes'        => \App\Models\GameMediaMix::orderBy('id')->get(['id', 'name']),
        ]);
    }

    /**
     * メディアミックスと同期処理
     *
     * @param LinkMultiMediaMixRequest $request
     * @param GameMediaMixGroup $mediaMixGroup
     * @return RedirectResponse
     */
    public function syncMediaMix(LinkMultiMediaMixRequest $request, GameMediaMixGroup $mediaMixGroup): RedirectResponse
    {
        foreach ($mediaMixGroup->mediaMixes as $mm) {
            $mm->game_media_mix_group_id = null;
            $mm->save();
        }
        foreach ($request->validated('game_media_mix_ids') as $mediaMixId) {
            $mediaMix = GameMediaMix::find($mediaMixId);
            $mediaMix->game_franchise_id = null;
            $mediaMix->game_media_mix_group_id = $mediaMixGroup->id;
            $mediaMix->save();
        }

        return redirect()->route('Admin.Game.MediaMixGroup.Detail', $mediaMixGroup);
    }
}

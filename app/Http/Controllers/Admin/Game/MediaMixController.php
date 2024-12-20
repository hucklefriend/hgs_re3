<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiRelatedProductRequest;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Http\Requests\Admin\Game\MediaMixMultiUpdateRequest;
use App\Http\Requests\Admin\Game\MediaMixRequest;
use App\Models\Extensions\GameTree;
use App\Models\GameMediaMix;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MediaMixController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.media_mix.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $mediaMixes = GameMediaMix::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $mediaMixes->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->where('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession($search);

        return [
            'mediaMixes' => $mediaMixes->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ];
    }

    /**
     * 詳細
     *
     * @param \App\Models\GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function detail(\App\Models\GameMediaMix $mediaMix): Application|Factory|View
    {
        return view('admin.game.media_mix.detail', [
            'model' => $mediaMix,
            'tree'  => GameTree::getTree($mediaMix),
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        $franchises = \App\Models\GameFranchise::select(['id', 'name'])->orderBy('id')
            ->get()->pluck('name', 'id');
        return view('admin.game.media_mix.add', [
            'model'      => new GameMediaMix(),
            'franchises' => $franchises,
        ]);
    }

    /**
     * 追加処理
     *
     * @param MediaMixRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(MediaMixRequest $request): RedirectResponse
    {
        $mediaMix = new GameMediaMix();
        $mediaMix->fill($request->validated());
        $mediaMix->setOgpInfo($request->post('ogp_url'));
        $mediaMix->save();

        return redirect()->route('Admin.Game.MediaMix.Detail', $mediaMix);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.game.media_mix.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param MediaMixMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(MediaMixMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $h1NodeNames = $request->validated(['h1_node_name']);
        $keys = $request->validated(['key']);
        foreach ($nodeNames as $id => $nodeName) {
            $model = GameMediaMix::find($id);
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
     * 編集画面
     *
     * @param \App\Models\GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function edit(\App\Models\GameMediaMix $mediaMix): Application|Factory|View
    {
        $franchises = \App\Models\GameFranchise::select(['id', 'name'])->orderBy('id')->get();
        return view('admin.game.media_mix.edit', [
            'model'      => $mediaMix,
            'franchises' => $franchises,
        ]);
    }

    /**
     * 更新処理
     *
     * @param MediaMixRequest $request
     * @param \App\Models\GameMediaMix $mediaMix
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(MediaMixRequest $request, \App\Models\GameMediaMix $mediaMix): RedirectResponse
    {
        $mediaMix->fill($request->validated());
        $mediaMix->setOgpInfo($request->post('ogp_url'));
        $mediaMix->save();

        return redirect()->route('Admin.Game.MediaMix.Detail', $mediaMix);
    }

    /**
     * 複製画面
     *
     * @param GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function copy(GameMediaMix $mediaMix): Application|Factory|View
    {
        $franchises = \App\Models\GameFranchise::select(['id', 'name'])->orderBy('id')
            ->get()->pluck('name', 'id');
        return view('admin.game.media_mix.copy', [
            'mediaMix'   => $mediaMix,
            'model'      => $mediaMix->replicate(),
            'franchises' => $franchises,
        ]);
    }

    /**
     * 削除
     *
     * @param \App\Models\GameMediaMix $mediaMix
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GameMediaMix $mediaMix): RedirectResponse
    {
        $mediaMix->relatedProducts()->detach();
        $mediaMix->delete();

        return redirect()->route('Admin.Game.MediaMix');
    }

    /**
     * タイトルとリンク
     *
     * @param GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function linkTitle(\App\Models\GameMediaMix $mediaMix): Application|Factory|View
    {
        $titles = \App\Models\GameTitle::orderBy('id')->get(['id', 'name']);
        return view('admin.game.media_mix.link_title', [
            'model' => $mediaMix,
            'linkedTitleIds' => $mediaMix->titles()->pluck('id')->toArray(),
            'titles' => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param LinkMultiTitleRequest $request
     * @param GameMediaMix $mediaMix
     * @return RedirectResponse
     */
    public function syncTitle(LinkMultiTitleRequest $request, \App\Models\GameMediaMix $mediaMix): RedirectResponse
    {
        $mediaMix->titles()->sync($request->validated('game_title_ids'));
        return redirect()->route('Admin.Game.MediaMix.Detail', $mediaMix);
    }

    /**
     * 関連商品とリンク
     *
     * @param \App\Models\GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function linkRelatedProduct(\App\Models\GameMediaMix $mediaMix): Application|Factory|View
    {
        $relatedProducts = \App\Models\GameRelatedProduct::orderBy('id')->get(['id', 'name']);
        return view('admin.game.media_mix.link_related_product', [
            'model' => $mediaMix,
            'linkedRelatedProductIds' => $mediaMix->relatedProducts()->pluck('id')->toArray(),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * 関連商品と同期処理
     *
     * @param LinkMultiRelatedProductRequest $request
     * @param \App\Models\GameMediaMix $mediaMix
     * @return RedirectResponse
     */
    public function syncRelatedProduct(LinkMultiRelatedProductRequest $request, GameMediaMix $mediaMix): RedirectResponse
    {
        $mediaMix->relatedProducts()->sync($request->validated('game_related_product_ids'));
        return redirect()->route('Admin.Game.MediaMix.Detail', $mediaMix);
    }
}

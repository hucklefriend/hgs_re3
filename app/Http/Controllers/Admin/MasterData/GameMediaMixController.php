<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\MasterData\GameMediaMixMultiUpdateRequest;
use App\Http\Requests\Admin\MasterData\GameMediaMixRelatedProductLinkRequest;
use App\Models\MasterData\GameFranchise;
use App\Models\MasterData\GameMediaMix;
use App\Http\Requests\Admin\MasterData\GameMediaMixRequest;
use App\Models\MasterData\GameMediaMixRelatedProductLink;
use App\Models\MasterData\GameRelatedProduct;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GameMediaMixController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.master_data.game_media_mix.index', $this->search($request));
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
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                    $query->orWhere('phonetic', operator: 'LIKE', value: '%' . $word . '%');
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
     * @param GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function detail(GameMediaMix $mediaMix): Application|Factory|View
    {
        return view('admin.master_data.game_media_mix.detail', [
            'model' => $mediaMix
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        $franchises = GameFranchise::select(['id', 'name'])->orderBy('id')
            ->get()->pluck('name', 'id');
        return view('admin.master_data.game_media_mix.add', [
            'model'      => new GameMediaMix(),
            'franchises' => $franchises,
        ]);
    }

    /**
     * 追加処理
     *
     * @param GameMediaMixRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GameMediaMixRequest $request): RedirectResponse
    {
        $mediaMix = new GameMediaMix();
        $mediaMix->fill($request->validated());
        $mediaMix->save();

        return redirect()->route('Admin.MasterData.MediaMix.Detail', $mediaMix);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.master_data.game_media_mix.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param GameMediaMixMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(GameMediaMixMultiUpdateRequest $request): RedirectResponse
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
     * @param GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function edit(GameMediaMix $mediaMix): Application|Factory|View
    {
        $franchises = GameFranchise::select(['id', 'name'])->orderBy('id')->get();
        return view('admin.master_data.game_media_mix.edit', [
            'model'      => $mediaMix,
            'franchises' => $franchises,
        ]);
    }

    /**
     * 更新処理
     *
     * @param GameMediaMixRequest $request
     * @param GameMediaMix $mediaMix
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GameMediaMixRequest $request, GameMediaMix $mediaMix): RedirectResponse
    {
        $mediaMix->fill($request->validated());
        $mediaMix->save();

        return redirect()->route('Admin.MasterData.MediaMix.Detail', $mediaMix);
    }

    /**
     * 削除
     *
     * @param GameMediaMix $mediaMix
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GameMediaMix $mediaMix): RedirectResponse
    {
        $mediaMix->relatedProducts()->detach();
        $mediaMix->delete();

        return redirect()->route('Admin.MasterData.MediaMix');
    }

    /**
     * 関連商品とリンク
     *
     * @param GameMediaMix $mediaMix
     * @return Application|Factory|View
     */
    public function linkRelatedProduct(GameMediaMix $mediaMix): Application|Factory|View
    {
        $relatedProducts = GameRelatedProduct::orderBy('id')->get(['id', 'name']);
        return view('admin.master_data.game_media_mix.link_related_product', [
            'model' => $mediaMix,
            'linkedRelatedProductIds' => $mediaMix->relatedProducts()->pluck('id')->toArray(),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * 関連商品と同期処理
     *
     * @param GameMediaMixRelatedProductLinkRequest $request
     * @param GameMediaMix $mediaMix
     * @return RedirectResponse
     */
    public function syncTitle(GameMediaMixRelatedProductLinkRequest $request, GameMediaMix $mediaMix): RedirectResponse
    {
        $mediaMix->relatedProducts()->sync($request->validated('related_product_id'));
        return redirect()->route('Admin.MasterData.MediaMix.Detail', $mediaMix);
    }
}

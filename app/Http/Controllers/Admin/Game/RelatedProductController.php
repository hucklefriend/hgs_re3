<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiMediaMixRequest;
use App\Http\Requests\Admin\Game\RelatedProductMultiUpdateRequest;
use App\Http\Requests\Admin\Game\LinkMultiPlatformRequest;
use App\Http\Requests\Admin\Game\RelatedProductRequest;
use App\Http\Requests\Admin\Game\RelatedProductShopRequest;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Models\Game\GameMediaMix;
use App\Models\Game\GamePlatform;
use App\Models\Game\GameRelatedProduct;
use App\Models\Game\GameRelatedProductShop;
use App\Models\Game\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RelatedProductController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.related_product.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $relatedProducts = GameRelatedProduct::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $relatedProducts->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->orWhere('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession($search);

        return [
            'relatedProducts' => $relatedProducts->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search'          => $search
        ];
    }

    /**
     * 詳細
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function detail(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        return view('admin.game.related_product.detail', [
            'model' => $relatedProduct
        ]);
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        return view('admin.game.related_product.add', [
            'model' => new GameRelatedProduct(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param RelatedProductRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(RelatedProductRequest $request): RedirectResponse
    {
        $relatedProduct = new GameRelatedProduct();
        $relatedProduct->fill($request->validated());
        $relatedProduct->save();

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.game.related_product.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param RelatedProductMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(RelatedProductMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $h1NodeNames = $request->validated(['h1_node_name']);
        foreach ($nodeNames as $id => $nodeName) {
            $maker = GameRelatedProduct::find($id);
            if ($maker !== null) {
                $maker->node_name = $nodeName;
                $maker->h1_node_name = $h1NodeNames[$id];
                $maker->save();
            }
        }

        return redirect()->back();
    }

    /**
     * 編集画面
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function edit(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        return view('admin.game.related_product.edit', [
            'model' => $relatedProduct
        ]);
    }

    /**
     * 更新処理
     *
     * @param RelatedProductRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(RelatedProductRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->fill($request->validated());
        $relatedProduct->save();

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * 削除
     *
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function delete(GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->titles()->detach();
        $relatedProduct->mediaMixes()->detach();
        $relatedProduct->platforms()->detach();
        $relatedProduct->delete();

        return redirect()->route('Admin.Game.RelatedProduct');
    }

    /**
     * プラットフォームとリンク
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function linkPlatform(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        $platforms = GamePlatform::orderBy('id')->get(['id', 'name']);
        return view('admin.game.related_product.link_platform', [
            'model'             => $relatedProduct,
            'linkedPlatformIds' => $relatedProduct->platforms()->pluck('id')->toArray(),
            'platforms'         => $platforms,
        ]);
    }

    /**
     * プラットフォームと同期処理
     *
     * @param LinkMultiPlatformRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     */
    public function syncPlatform(LinkMultiPlatformRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->platforms()->sync($request->validated('game_platform_ids'));
        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * タイトルとリンク
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function linkTitle(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        $titles = GameTitle::orderBy('id')->get(['id', 'name']);
        return view('admin.game.related_product.link_title', [
            'model'          => $relatedProduct,
            'linkedTitleIds' => $relatedProduct->titles()->pluck('id')->toArray(),
            'titles'         => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param LinkMultiTitleRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     */
    public function syncTitle(LinkMultiTitleRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->titles()->sync($request->validated('game_title_ids'));
        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * メディアミックスとリンク
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function linkMediaMix(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        $mediaMixes = GameMediaMix::orderBy('id')->get();
        return view('admin.game.related_product.link_media_mix', [
            'model' => $relatedProduct,
            'linkedMediaMixIds' => $relatedProduct->mediaMixes()->pluck('id')->toArray(),
            'mediaMixes' => $mediaMixes,
        ]);
    }

    /**
     * メディアミックスと同期処理
     *
     * @param LinkMultiMediaMixRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     */
    public function syncMediaMix(LinkMultiMediaMixRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->mediaMixes()->sync($request->validated('game_media_mix_ids'));
        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの登録
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function addShop(GameRelatedProduct $relatedProduct)
    {
        $excludeShopList = $relatedProduct->shops()->pluck('shop_id')->toArray();

        return view('admin.game.related_product.add_shop', [
            'relatedProduct'  => $relatedProduct,
            'excludeShopList' => $excludeShopList,
            'model'           => new GameRelatedProductShop(),
        ]);
    }

    /**
     * ショップの登録処理
     *
     * @param RelatedProductShopRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     */
    public function storeShop(RelatedProductShopRequest $request, GameRelatedProduct $relatedProduct)
    {
        $shop = new GameRelatedProductShop();
        $shop->game_related_product_id = $relatedProduct->id;

        $validated = $request->validated();
        $useImgTag = ($validated['use_img_tag'] ?? 0) == 1;
        unset($validated['use_img_tag']);

        $shop->fill($validated);
        $shop->save();

        if ($useImgTag) {
            $relatedProduct->img_shop_id = $shop->id;
            $relatedProduct->save();
        }

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの編集
     *
     * @param GameRelatedProduct $relatedProduct
     * @param $shopId
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function editShop(GameRelatedProduct $relatedProduct, $shopId)
    {
        $shop = $relatedProduct->shops()->firstWhere('shop_id', $shopId);
        return view('admin.game.related_product.edit_shop', [
            'relatedProduct' => $relatedProduct,
            'model'          => $shop,
        ]);
    }

    /**
     * ショップの編集処理
     *
     * @param RelatedProductShopRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @param $shopId
     * @return RedirectResponse
     */
    public function updateShop(RelatedProductShopRequest $request, GameRelatedProduct $relatedProduct, $shopId)
    {
        $shop = $relatedProduct->shops()->firstWhere('shop_id', $shopId);
        $shop->fill($request->validated());
        $shop->save();

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの削除
     *
     * @param GameRelatedProduct $relatedProduct
     * @param $shopId
     * @return RedirectResponse
     */
    public function deleteShop(GameRelatedProduct $relatedProduct, $shopId)
    {
        $relatedProduct->shops()->where('shop_id', $shopId)->delete();
        if ($relatedProduct->img_shop_id == $shopId) {
            $relatedProduct->img_shop_id = null;
            $relatedProduct->save();
        }

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }
}

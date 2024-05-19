<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\MasterData\GameRelatedProductRequest;
use App\Http\Requests\Admin\MasterData\GameRelatedProductShopRequest;
use App\Http\Requests\Admin\MasterData\GameRelatedProductTitleLinkRequest;
use App\Models\MasterData\GameMediaMix;
use App\Models\MasterData\GameRelatedProduct;
use App\Models\MasterData\GameRelatedProductShop;
use App\Models\MasterData\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GameRelatedProductController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
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

        $this->saveSearchSession('search_game_related_product', $search);

        return view('admin.master_data.game_related_product.index', [
            'relatedProducts' => $relatedProducts->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search'          => $search
        ]);
    }

    /**
     * 詳細
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function detail(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        return view('admin.master_data.game_related_product.detail', [
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
        return view('admin.master_data.game_related_product.add', [
            'model' => new GameRelatedProduct(),
        ]);
    }

    /**
     * 追加処理
     *
     * @param GameRelatedProductRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function store(GameRelatedProductRequest $request): RedirectResponse
    {
        $relatedProduct = new GameRelatedProduct();
        $relatedProduct->fill($request->validated());
        $relatedProduct->save();

        return redirect()->route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * 編集画面
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function edit(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        return view('admin.master_data.game_related_product.edit', [
            'model' => $relatedProduct
        ]);
    }

    /**
     * 更新処理
     *
     * @param GameRelatedProductRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function update(GameRelatedProductRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->fill($request->validated());
        $relatedProduct->save();

        return redirect()->route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct);
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
        $relatedProduct->delete();

        return redirect()->route('Admin.MasterData.RelatedProduct');
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
        return view('admin.master_data.game_related_product.link_title', [
            'model' => $relatedProduct,
            'linkedTitleIds' => $relatedProduct->titles()->pluck('id')->toArray(),
            'titles' => $titles,
        ]);
    }

    /**
     * タイトルと同期処理
     *
     * @param GameRelatedProductTitleLinkRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     */
    public function syncTitle(GameRelatedProductTitleLinkRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->titles()->sync($request->validated('title_id'));
        return redirect()->route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * メディアミックスとリンク
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function linkMediaMix(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        $mediaMixes = GameMediaMix::orderBy('id')->get(['id', 'name']);
        return view('admin.master_data.game_related_product.link_media_mix', [
            'model' => $relatedProduct,
            'linkedMediaMixIds' => $relatedProduct->mediaMixes()->pluck('id')->toArray(),
            'mediaMixes' => $mediaMixes,
        ]);
    }

    /**
     * メディアミックスと同期処理
     *
     * @param GameRelatedProductTitleLinkRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     */
    public function syncMediaMix(GameRelatedProductTitleLinkRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->mediaMixes()->sync($request->validated('media_mix_id'));
        return redirect()->route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの登録
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function addShop(GameRelatedProduct $relatedProduct)
    {
        return view('admin.master_data.game_related_product.add_shop', [
            'relatedProduct' => $relatedProduct,
            'model'          => new GameRelatedProductShop(),
        ]);
    }

    /**
     * ショップの登録処理
     *
     * @param GameRelatedProductShopRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     */
    public function storeShop(GameRelatedProductShopRequest $request, GameRelatedProduct $relatedProduct)
    {
        $shop = new GameRelatedProductShop();
        $shop->game_related_product_id = $relatedProduct->id;
        $shop->fill($request->validated());
        $shop->save();
        return redirect()->route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの編集
     *
     * @param GameRelatedProduct $relatedProduct
     * @param $shop_id
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function editShop(GameRelatedProduct $relatedProduct, $shop_id)
    {
        $shop = $relatedProduct->shops()->firstWhere('shop_id', $shop_id);
        return view('admin.master_data.game_related_product.edit_shop', [
            'relatedProduct' => $relatedProduct,
            'model'          => $shop,
        ]);
    }

    /**
     * ショップの編集処理
     *
     * @param GameRelatedProductShopRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @param $shop_id
     * @return RedirectResponse
     */
    public function updateShop(GameRelatedProductShopRequest $request, GameRelatedProduct $relatedProduct, $shop_id)
    {
        $shop = $relatedProduct->shops()->firstWhere('shop_id', $shop_id);
        $shop->fill($request->validated());
        $shop->save();

        return redirect()->route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの削除
     *
     * @param GameRelatedProduct $relatedProduct
     * @param $shop_id
     * @return RedirectResponse
     */
    public function deleteShop(GameRelatedProduct $relatedProduct, $shop_id)
    {
        $relatedProduct->shops()->where('shop_id', $shop_id)->delete();

        return redirect()->route('Admin.MasterData.RelatedProduct.Detail', $relatedProduct);
    }
}

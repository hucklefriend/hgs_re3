<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiMediaMixRequest;
use App\Http\Requests\Admin\Game\LinkMultiPlatformRequest;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Http\Requests\Admin\Game\RelatedProductMultiUpdateRequest;
use App\Http\Requests\Admin\Game\RelatedProductRequest;
use App\Http\Requests\Admin\Game\RelatedProductShopRequest;
use App\Models\Extensions\GameTree;
use App\Models\GameMediaMix;
use App\Models\GameRelatedProduct;
use App\Models\GameRelatedProductShop;
use App\Models\GameTitle;
use App\Models\GamePlatform;
use App\Models\MasterJsonImportLog;
use App\Services\MasterJson\RelatedProductMasterJsonService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

class RelatedProductController extends AbstractAdminController
{
    public function __construct(
        private readonly RelatedProductMasterJsonService $relatedProductMasterJsonService,
    ) {
    }

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
        $relatedProducts = \App\Models\GameRelatedProduct::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $relatedProducts->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->where('name', operator: 'LIKE', value: '%' . $word . '%');
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
            'model' => $relatedProduct,
            'tree'  => GameTree::getTree($relatedProduct),
        ]);
    }

    /**
     * AIに渡すJSONの出力画面
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function jsonExport(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        return view('admin.game.related_product.json_export', [
            'model' => $relatedProduct,
            'json'  => json_encode($this->relatedProductMasterJsonService->export($relatedProduct), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * AIが書き換えたJSONの貼り付け画面
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function jsonImport(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        return view('admin.game.related_product.json_import', [
            'model' => $relatedProduct,
        ]);
    }

    /**
     * 貼り付けられたJSONと現在のデータの差分を表示
     *
     * @param Request $request
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View|RedirectResponse
     */
    public function jsonDiff(Request $request, GameRelatedProduct $relatedProduct): Application|Factory|View|RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $diff = $this->relatedProductMasterJsonService->diff($relatedProduct, $importedJson);

        if (!empty($diff['errors'])) {
            return redirect()->route('Admin.Game.RelatedProduct.JsonImport', $relatedProduct)
                ->withErrors(['imported_json' => implode(' / ', $diff['errors'])])
                ->withInput();
        }

        return view('admin.game.related_product.json_diff', [
            'model'        => $relatedProduct,
            'diff'         => $diff,
            'importedJson' => $importedJson,
        ]);
    }

    /**
     * 採用された差分をデータへ反映
     *
     * @param Request $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     * @throws Throwable
     */
    public function jsonApply(Request $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $accept = $request->input('accept', []);
        $beforeJson = json_encode($this->relatedProductMasterJsonService->export($relatedProduct), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        try {
            $applied = $this->relatedProductMasterJsonService->apply($relatedProduct, $importedJson, $accept);
        } catch (\Throwable $e) {
            return redirect()->route('Admin.Game.RelatedProduct.JsonImport', $relatedProduct)
                ->withErrors(['imported_json' => $e->getMessage()])
                ->withInput();
        }

        MasterJsonImportLog::create([
            'admin_user_id'     => Auth::guard('admin')->id(),
            'target_type'       => 'related_product',
            'target_id'         => $relatedProduct->id,
            'before_json'       => $beforeJson,
            'imported_json'     => $importedJson,
            'applied_diff_json' => json_encode($applied, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct)
            ->with('success', 'JSONの内容をデータに反映しました。');
    }

    /**
     * JSONからの新規作成画面
     *
     * @return Application|Factory|View
     */
    public function jsonNew(): Application|Factory|View
    {
        return view('admin.game.related_product.json_new', [
            'json' => json_encode($this->relatedProductMasterJsonService->template(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * JSONからの新規作成: 差分（作成内容）確認
     *
     * @param Request $request
     * @return Application|Factory|View|RedirectResponse
     */
    public function jsonNewDiff(Request $request): Application|Factory|View|RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $diff = $this->relatedProductMasterJsonService->diffNew($importedJson);

        if (!empty($diff['errors'])) {
            return redirect()->route('Admin.Game.RelatedProduct.JsonNew')
                ->withErrors(['imported_json' => implode(' / ', $diff['errors'])])
                ->withInput();
        }

        return view('admin.game.related_product.json_diff_new', [
            'diff'         => $diff,
            'importedJson' => $importedJson,
        ]);
    }

    /**
     * JSONからの新規作成: 反映
     *
     * @param Request $request
     * @return RedirectResponse
     * @throws Throwable
     */
    public function jsonNewApply(Request $request): RedirectResponse
    {
        $importedJson = (string) $request->input('imported_json', '');
        $accept = $request->input('accept', []);

        try {
            $result = $this->relatedProductMasterJsonService->applyNew($importedJson, $accept);
        } catch (\Throwable $e) {
            return redirect()->route('Admin.Game.RelatedProduct.JsonNew')
                ->withErrors(['imported_json' => $e->getMessage()])
                ->withInput();
        }

        MasterJsonImportLog::create([
            'admin_user_id'     => Auth::guard('admin')->id(),
            'target_type'       => 'related_product',
            'target_id'         => $result['id'],
            'before_json'       => json_encode(null),
            'imported_json'     => $importedJson,
            'applied_diff_json' => json_encode($result['applied'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);

        return redirect()->route('Admin.Game.RelatedProduct.Detail', ['relatedProduct' => $result['id']])
            ->with('success', 'JSONの内容から新規作成しました。');
    }

    /**
     * 追加画面
     *
     * @return Application|Factory|View
     */
    public function add(): Application|Factory|View
    {
        $linked = json_encode([
            'title_id'     => request()->query('title_id', null),
            'platform_id'  => request()->query('platform_id', null),
            'media_mix_id' => request()->query('media_mix_id', null),
        ]);

        $parentModel = null;

        if (request()->query('title_id') !== null) {
            $parentModel = GameTitle::find(request()->query('title_id'));
        } else if (request()->query('platform_id') !== null) {
            $parentModel = GamePlatform::find(request()->query('platform_id'));
        } else if (request()->query('media_mix_id') !== null) {
            $parentModel = GameMediaMix::find(request()->query('media_mix_id'));
        }

        $model = new GameRelatedProduct();
        if ($parentModel !== null) {
            $model->name = $parentModel->name;
        }

        return view('admin.game.related_product.add', [
            'model'  => $model,
            'linked' => $linked,
            'parentModel' => $parentModel,
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
        $relatedProduct = new \App\Models\GameRelatedProduct();
        $relatedProduct->fill($request->validated());
        $relatedProduct->save();

        $linked = json_decode($request->post('linked'), true);
        if ($linked['title_id'] !== null) {
            $relatedProduct->titles()->attach($linked['title_id']);
            return redirect()->route('Admin.Game.Title.Detail', ['title' => $linked['title_id']]);
        } else if ($linked['platform_id'] !== null) {
            $relatedProduct->platforms()->attach($linked['platform_id']);
            return redirect()->route('Admin.Game.Platform.Detail', ['platform' => $linked['platform_id']]);
        } else if ($linked['media_mix_id'] !== null) {
            $relatedProduct->mediaMixes()->attach($linked['media_mix_id']);
            return redirect()->route('Admin.Game.MediaMix.Detail', ['media_mix' => $linked['media_mix_id']]);
        } else {
            return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
        }
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
        foreach ($nodeNames as $id => $nodeName) {
            $maker = GameRelatedProduct::find($id);
            if ($maker !== null) {
                $maker->node_name = $nodeName;
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
    public function edit(\App\Models\GameRelatedProduct $relatedProduct): Application|Factory|View
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
     * 複製画面
     *
     * @param GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function copy(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        return view('admin.game.related_product.copy', [
            'relatedProduct' => $relatedProduct,
            'model' => $relatedProduct->replicate(),
        ]);
    }

    /**
     * 複製処理
     *
     * @param RelatedProductRequest $request
     * @param GameRelatedProduct $relatedProduct
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function makeCopy(RelatedProductRequest $request, GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $newRP = new \App\Models\GameRelatedProduct();
        $newRP->fill($request->validated());
        $newRP->save();

        if ($relatedProduct->platforms->count() > 0) {
            $newRP->platforms()->sync($relatedProduct->platforms->pluck('id')->toArray());
        }
        if ($relatedProduct->titles->count() > 0) {
            $newRP->titles()->sync($relatedProduct->titles->pluck('id')->toArray());
        }
        if ($relatedProduct->mediaMixes->count() > 0) {
            $newRP->mediaMixes()->sync($relatedProduct->mediaMixes->pluck('id')->toArray());
        }

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $newRP);
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
     * @param \App\Models\GameRelatedProduct $relatedProduct
     * @return Application|Factory|View
     */
    public function linkPlatform(GameRelatedProduct $relatedProduct): Application|Factory|View
    {
        $platforms = \App\Models\GamePlatform::orderBy('id')->get(['id', 'name']);
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
        $titles = \App\Models\GameTitle::orderBy('id')->get(['id', 'name']);
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
        $mediaMixes = GameMediaMix::orderByDesc('id')->get();
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
    public function syncMediaMix(LinkMultiMediaMixRequest $request, \App\Models\GameRelatedProduct $relatedProduct): RedirectResponse
    {
        $relatedProduct->mediaMixes()->sync($request->validated('game_media_mix_ids'));
        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの登録
     *
     * @param \App\Models\GameRelatedProduct $relatedProduct
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function addShop(GameRelatedProduct $relatedProduct)
    {
        return view('admin.game.related_product.add_shop', [
            'relatedProduct'  => $relatedProduct,
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
    public function storeShop(RelatedProductShopRequest $request, \App\Models\GameRelatedProduct $relatedProduct)
    {
        $shop = new GameRelatedProductShop();
        $shop->game_related_product_id = $relatedProduct->id;

        $validated = $request->validated();

        $shop->fill($validated);
        $shop->setOgpInfo($request->post('ogp_url'));
        $shop->save();

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの編集
     *
     * @param GameRelatedProduct $relatedProduct
     * @param GameRelatedProductShop $shop
     * @return Application|Factory|View|\Illuminate\Foundation\Application|\Illuminate\View\View
     */
    public function editShop(GameRelatedProduct $relatedProduct, GameRelatedProductShop $shop)
    {
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
     * @param GameRelatedProductShop $shop
     * @return RedirectResponse
     */
    public function updateShop(RelatedProductShopRequest $request, GameRelatedProduct $relatedProduct, GameRelatedProductShop $shop)
    {
        $shop->fill($request->validated());
        $shop->setOgpInfo($request->post('ogp_url'));
        $shop->save();

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }

    /**
     * ショップの削除
     *
     * @param GameRelatedProduct $relatedProduct
     * @param GameRelatedProductShop $shop
     * @return RedirectResponse
     */
    public function deleteShop(GameRelatedProduct $relatedProduct, GameRelatedProductShop $shop)
    {
        $shop->delete();

        return redirect()->route('Admin.Game.RelatedProduct.Detail', $relatedProduct);
    }
}

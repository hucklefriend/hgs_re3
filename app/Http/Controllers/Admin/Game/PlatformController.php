<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\GamePlatformMultiUpdateRequest;
use App\Http\Requests\Admin\Game\RelatedProductLinkRequest;
use App\Models\Game\GamePlatform;
use App\Http\Requests\Admin\Game\GamePlatformRequest;
use App\Models\Game\GameRelatedProduct;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PlatformController extends AbstractAdminController
{
    /**
     * インデックス
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function index(Request $request): Application|Factory|View
    {
        return view('admin.game.platform.index', $this->search($request));
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function search(Request $request): array
    {
        $platforms = GamePlatform::orderByDesc('id');

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

        $this->saveSearchSession($search);

        return [
            'search' => $search,
            'platforms' => $platforms->paginate(AdminDefine::ITEMS_PER_PAGE),
        ];
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
        return view('admin.game.platform.detail', [
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
        return view('admin.game.platform.add', [
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

        return redirect()->route('Admin.Game.Platform.Detail', $platform);
    }

    /**
     * 一括更新
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editMulti(Request $request): Application|Factory|View
    {
        return view('admin.game.platform.edit_multi', $this->search($request));
    }

    /**
     * 更新処理
     *
     * @param GamePlatformMultiUpdateRequest $request
     * @return RedirectResponse
     * @throws \Throwable
     */
    public function updateMulti(GamePlatformMultiUpdateRequest $request): RedirectResponse
    {
        $nodeNames = $request->validated(['node_name']);
        $h1NodeNames = $request->validated(['h1_node_name']);
        $keys = $request->validated(['key']);
        foreach ($nodeNames as $id => $nodeName) {
            $model = GamePlatform::find($id);
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
     * @param GamePlatform $platform
     * @return Application|Factory|View
     */
    public function edit(GamePlatform $platform): Application|Factory|View
    {
        $platform->loadSynonyms();
        return view('admin.game.platform.edit', [
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

        return redirect()->route('Admin.Game.Platform.Detail', $platform);
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

        return redirect()->route('Admin.Game.Platform');
    }

    /**
     * 関連商品とリンク
     *
     * @param GamePlatform $platform
     * @return Application|Factory|View
     */
    public function linkRelatedProduct(GamePlatform $platform): Application|Factory|View
    {
        $relatedProducts = GameRelatedProduct::orderBy('id')->get(['id', 'name']);
        return view('admin.game.platform.link_related_product', [
            'model' => $platform,
            'linkedRelatedProductIds' => $platform->relatedProducts()->pluck('id')->toArray(),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * 関連商品と同期処理
     *
     * @param RelatedProductLinkRequest $request
     * @param GamePlatform $platform
     * @return RedirectResponse
     */
    public function syncRelatedProduct(RelatedProductLinkRequest $request, GamePlatform $platform): RedirectResponse
    {
        $platform->relatedProducts()->sync($request->validated('related_product_id'));
        return redirect()->route('Admin.Game.Platform.Detail', $platform);
    }
}

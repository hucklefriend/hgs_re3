<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Http\Requests\Admin\Game\LinkMultiTitleRequest;
use App\Http\Requests\Admin\Game\SeriesRequest;
use App\Models\Extensions\GameTree;
use App\Models\GameFranchise;
use App\Models\GameSeries;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MainNetworkController extends AbstractAdminController
{
    /**
     * ネットワーク編集
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function editNetwork(Request $request): Application|Factory|View
    {
        $franchises = GameFranchise::all();




        return view('admin.game.main_network.edit_network');
    }

    /**
     * 検索処理
     *
     * @param Request $request
     * @return array
     */
    private function saveNetwork(Request $request): array
    {
        $series = \App\Models\GameSeries::orderBy('id');

        $searchName = trim($request->query('name', ''));
        $search = ['name' => ''];

        if (!empty($searchName)) {
            $search['name'] = $searchName;
            $words = explode(' ', $searchName);

            $series->where(function ($query) use ($words) {
                foreach ($words as $word) {
                    $query->where('name', operator: 'LIKE', value: '%' . $word . '%');
                }
            });
        }

        $this->saveSearchSession($search);

        return  [
            'series' => $series->paginate(AdminDefine::ITEMS_PER_PAGE),
            'search' => $search
        ];
    }
}

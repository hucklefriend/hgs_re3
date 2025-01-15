<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Models\GameMainNetworkFranchise;
use App\Models\GameSeries;
use App\Models\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

class MainNetworkController extends AbstractAdminController
{
    /**
     * ネットワーク編集
     *
     * @param Request $request
     * @return Application|Factory|View
     */
    public function edit(Request $request): Application|Factory|View
    {
        $networks = GameMainNetworkFranchise::all();
        $seriesNames = GameSeries::all()->pluck('name', 'id');
        $titleNames = GameTitle::all()->pluck('node_name', 'id');

        $data = [];
        foreach ($networks as $network) {
            $json = json_decode($network->json, true);

            $json['parent']['name'] = $network->franchise->name . '<br>フランチャイズ';

            foreach ($json['nodes'] as $key => $node) {
                [$prefix, $id] = explode('_', $key);

                if ($prefix === 'f') {
                    $json['nodes'][$key]['name'] = $network->franchise->name . '<br>フランチャイズ';
                } else if ($prefix === 's') {
                    $json['nodes'][$key]['name'] = $seriesNames[$id] . '<br>シリーズ';
                } else if ($prefix === 't') {
                    $json['nodes'][$key]['name'] = $titleNames[$id];
                }
            }

            $id = "f_" . $network->franchise->id;
            $json['id'] = $id;
            $data[$id] = $json;
        }

        return view('admin.game.main_network.edit_network', [
            'networks' => $networks,
            'data' => $data
        ]);
    }

    /**
     * 保存
     *
     * @param Request $request
     * @return array
     */
    public function save(Request $request): array
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

<?php

namespace App\Http\Controllers\Admin\Game;

use App\Defines\AdminDefine;
use App\Http\Controllers\Admin\AbstractAdminController;
use App\Models\GameMainNetwork;
use App\Models\GameMainNetworkFranchise;
use App\Models\GameMainNetworkParam;
use App\Models\GameSeries;
use App\Models\GameTitle;
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

        $mainNetworks = [];
        foreach (GameMainNetwork::all() as $mainNetwork) {
            $mainNetworks[] = [
                'id' => 'f_' . $mainNetwork->game_franchise_id,
                'x' => $mainNetwork->x,
                'y' => $mainNetwork->y
            ];
        }

        return view('admin.game.main_network.edit_network', [
            'mainNetworks' => $mainNetworks,
            'networks' => $networks,
            'data' => $data
        ]);
    }

    /**
     * 保存
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function save(Request $request): RedirectResponse
    {
        $json = json_decode($request->post('json'));

        foreach ($json->networks as $network) {
            [$prefix, $id] = explode('_', $network->id);

            $mainNetwork = GameMainNetwork::find($id);
            if ($mainNetwork === null) {
                $mainNetwork = new GameMainNetwork();
                $mainNetwork->game_franchise_id = $id;
            }
            $mainNetwork->x = $network->x;
            $mainNetwork->y = $network->y;
            $mainNetwork->save();
        }

        GameMainNetworkParam::saveNetworkRect(
            $json->rect->left, $json->rect->right,
            $json->rect->top, $json->rect->bottom
        );


        return redirect()->route('Admin.Game.MainNetwork');
    }
}

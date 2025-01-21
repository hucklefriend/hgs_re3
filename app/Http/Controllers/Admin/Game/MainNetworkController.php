<?php

namespace App\Http\Controllers\Admin\Game;

use App\Http\Controllers\Admin\AbstractAdminController;
use App\Models\GameFranchise;
use App\Models\GameMainNetworkFranchise;
use App\Models\GameMainNetworkParam;
use App\Models\GameSeries;
use App\Models\GameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $mainNetworks = [];

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

            if ($network->x !== null && $network->y !== null) {
                $mainNetworks[] = [
                    'id' => $id,
                    'x'  => $network->x,
                    'y'  => $network->y
                ];
            }
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
            $franchise = GameFranchise::find((int)$id);

            if ($franchise->mainNetwork !== null) {
                $franchise->mainNetwork->x = $network->x;
                $franchise->mainNetwork->y = $network->y;
                $franchise->mainNetwork->save();
            }
        }

        GameMainNetworkParam::saveNetworkRect(
            $json->rect->left, $json->rect->right,
            $json->rect->top, $json->rect->bottom
        );

        return redirect()->route('Admin.Game.MainNetwork');
    }
}

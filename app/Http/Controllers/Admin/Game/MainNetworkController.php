<?php

namespace App\Http\Controllers\Admin\Game;

use App\Enums\Rating;
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
use Illuminate\Support\Facades\Storage;

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
        $seriesNames = GameSeries::all()->pluck('node_name', 'id');
        $titles = GameTitle::all(['id', 'node_name', 'key', 'rating'])->pluck(null, 'id');
        $mainNetworks = [];

        $data = [];
        foreach ($networks as $network) {
            $json = json_decode($network->json, true);

            $json['parent']['html'] = $network->franchise->node_name . '<br>フランチャイズ';
            $json['parent']['type'] = 'link-node';
            $json['parent']['href'] = route('Game.FranchiseDetailNetwork',
                ['franchiseKey' => $network->franchise->key], false);

            foreach ($json['nodes'] as $key => $node) {
                [$prefix, $id] = explode('_', $key);

                if ($prefix === 'f') {
                    $json['nodes'][$key]['html'] = $network->franchise->name . '<br>フランチャイズ';
                    $json['nodes'][$key]['type'] = 'link-node';
                    $json['nodes'][$key]['href'] = route('Game.FranchiseDetailNetwork',
                        ['franchiseKey' => $network->franchise->key], false);
                } else if ($prefix === 's') {
                    $json['nodes'][$key]['html'] = $seriesNames[$id] . '<br>シリーズ';
                    $json['nodes'][$key]['type'] = 'dom-node';
                } else if ($prefix === 't') {
                    $json['nodes'][$key]['html'] = $titles[$id]['node_name'];
                    $json['nodes'][$key]['type'] = 'link-node';
                    $json['nodes'][$key]['href'] = route('Game.TitleDetailNetwork',
                        ['titleKey' => $titles[$id]['key']], false);

                    $json['nodes'][$key]['type'] .= match($titles[$id]['rating']) {
                        Rating::R18A => '-a',
                        Rating::R18Z => '-z',
                        default => ''
                    };
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

//        GameMainNetworkParam::saveNetworkRect(
//            $json->rect->left, $json->rect->right,
//            $json->rect->top, $json->rect->bottom
//        );

        Storage::put('public/main.json', $request->post('json2'));

        return redirect()->route('Admin.Game.MainNetwork');
    }
}

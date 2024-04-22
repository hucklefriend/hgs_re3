<?php

namespace App\Http\Controllers;

use App\Models\MasterData\GameFranchise;
use App\Models\MasterData\GameMaker;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GameController extends Controller
{
    /**
     * @return JsonResponse|Application|Factory|View
     */
    public function horrorGameNetwork(): JsonResponse|Application|Factory|View
    {
        $games = GameFranchise::select(['id', 'node_title'])->orderBy('phonetic')->get();

        return $this->network(view('game.horrorgame_network', ['games' => $games]));
    }

    public function makerNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $makers = GameMaker::select(['id', 'node_title'])->orderBy('phonetic')->get();

        return $this->network(view('game.maker_network', ['makers' => $makers]));
    }

    public function franchiseNetwork(Request $request, GameFranchise $franchise): JsonResponse|Application|Factory|View
    {
        $nodes = $franchise->series()->select(['id', 'node_title'])->orderBy('phonetic')->get();
        $nodes2 = $franchise->titles()->select(['id', 'node_title'])->orderBy('phonetic')->get();

        return $this->network(view('game.franchise_network', ['franchises' => $franchises]));
    }
}

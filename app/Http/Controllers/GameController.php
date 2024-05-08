<?php

namespace App\Http\Controllers;

use App\Models\MasterData\GameFranchise;
use App\Models\MasterData\GameMaker;
use App\Models\MasterData\GameTitle;
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
    const ITEM_PER_PAGE = 40;

    /**
     * ホラーゲームネットワーク
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     */
    public function horrorGameNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $page = $request->get('page', 1);

        $franchiseNum = GameFranchise::count();
        $maxPage = ceil($franchiseNum / self::ITEM_PER_PAGE);

        if ($page < 1) {
            $page = 1;
        } else if ($page > $maxPage) {
            $page = $maxPage;
        }

        $prevPage = $page - 1;
        if ($prevPage < 1) {
            $prevPage = null;
        }
        $nextPage = $page + 1;
        if ($nextPage > $maxPage) {
            $nextPage = null;
        }

        $franchises = GameFranchise::orderBy('phonetic')
            ->limit(self::ITEM_PER_PAGE)
            ->offset(($page - 1) * self::ITEM_PER_PAGE)
            ->get();

        $groups = [];
        $games = [];
        foreach ($franchises as $franchise) {
            $id = sprintf("g_%d_", $franchise->id);

            $titleNum = 0;
            foreach ($franchise->series as $series) {
                $titleNum = count($series->titles);
            }
            $titleNum += count($franchise->titles);

            if ($titleNum > 1) {
                $groups[] = $games;
                $games = [];
            }

            foreach ($franchise->series as $series) {
                $prevId = null;
                foreach ($series->titles as $title) {
                    $games[] = (object)[
                        'title'       => $title,
                        'dom_id'      => $id . $title->id,
                        'node_title'  => $title->node_title,
                        'connections' => is_null($prevId) ? [] : [$prevId],
                    ];

                    $prevId = $id . $title->id;
                }
            }

            foreach ($franchise->titles as $title) {
                $games[] = (object)[
                    'title'       => $title,
                    'dom_id'      => $id . $title->id,
                    'node_title'  => $title->node_title,
                    'connections' => [],
                ];
            }

            if ($titleNum > 1) {
                $groups[] = $games;
                $games = [];
            }
        }
        if (count($games) > 0) {
            $groups[] = $games;
        }

        return $this->network(view('game.horrorgame_network', [
            'groups' => $groups,
            'page'   => $page,
            'prev'   => $prevPage,
            'next'   => $nextPage,
        ]));
    }

    public function makerNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $makers = GameMaker::select(['id', 'node_title'])->orderBy('phonetic')->get();

        return $this->network(view('game.maker_network', ['makers' => $makers]));
    }

    public function franchiseNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        return $this->network(view('game.franchise_network', [
            'franchises' => GameFranchise::orderBy('phonetic')->get(),
        ]));
    }

    public function franchiseDetailNetwork(Request $request, GameFranchise $franchise): JsonResponse|Application|Factory|View
    {
        $titles = [];
        foreach ($franchise->series as $series) {
            foreach ($series->titles as $title) {
                $titles[] = $title;
            }
        }
        foreach ($franchise->titles as $title) {
            $titles[] = $title;
        }

        return $this->network(view('game.franchise_detail_network', [
            'franchise' => $franchise,
            'titles' => $titles
        ]));
    }

    public function titleNetwork(Request $request, GameTitle $title): JsonResponse|Application|Factory|View
    {
        $packages = $title->packages;
        $makers = [];
        foreach ($packages as $package) {
            if ($package->maker) {
                $makers[$package->maker->id] = $package->maker;
            }
        }

        return $this->network(view('game.title_network', [
            'title'    => $title,
            'packages' => $packages,
            'makers'   => $makers,
        ]));
    }
}

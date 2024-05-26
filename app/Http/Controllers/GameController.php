<?php

namespace App\Http\Controllers;

use App\Models\MasterData\GameFranchise;
use App\Models\MasterData\GameFranchiseSeriesLink;
use App\Models\MasterData\GameFranchiseTitleLink;
use App\Models\MasterData\GameMaker;
use App\Models\MasterData\GamePackage;
use App\Models\MasterData\GamePlatform;
use App\Models\MasterData\GameSeriesTitleLink;
use App\Models\MasterData\GameTitle;
use App\Models\MasterData\GameTitlePackageLink;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $queries = [];
        $search = ['n' => '', 'p' => [], 'r' => []];

        $franchisesQuery = GameFranchise::orderBy('phonetic');

        $name = $request->get('n', '');
        if (strlen($name) > 0) {
            $search['n'] = $name;
            $franchisesQuery->where('name', 'like', '%' . $name . '%');
        }

        $platforms = $request->get('p', '');
        $titleIds = [];
        if (!empty($platforms)) {
            $queries['p'] = $platforms;
            $platforms = explode(',', $platforms);
            $search['p'] = $platforms;
            $packages = GamePackage::select(['id'])->whereIn('game_platform_id', $platforms)->get()->pluck('id');
            $titles = GameTitlePackageLink::whereIn('game_package_id', $packages)->distinct()->get()->pluck('game_title_id');
            $series = GameSeriesTitleLink::whereIn('game_title_id', $titles)->distinct()->pluck('game_series_id');
            $franchisesBySeries = GameFranchiseSeriesLink::whereIn('game_series_id', $series)->distinct()->pluck('game_franchise_id');
            $franchisesByTitle = GameFranchiseTitleLink::whereIn('game_title_id', $series)->distinct()->pluck('game_franchise_id');
            $linkedFranchiseIds = $franchisesBySeries->merge($franchisesByTitle)->unique();
            $franchisesQuery->whereIn('id', $linkedFranchiseIds);

            $titleIds = $titles;
            if (!empty($series)) {
                $titleIds->merge(GameSeriesTitleLink::whereIn('game_series_id', $series)
                    ->distinct()->pluck('game_title_id')->toArray());
            }
        }

        $franchiseNum = $franchisesQuery->count();
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

        $franchises = $franchisesQuery
            ->limit(self::ITEM_PER_PAGE)
            ->offset(($page - 1) * self::ITEM_PER_PAGE)
            ->get();

        $groups = [];
        $games = [];
        foreach ($franchises as $franchise) {
            $id = sprintf("g_%d_", $franchise->id);

            $titleNum = 0;
            foreach ($franchise->series as $series) {
                $titleNum = count($series->titles->whereIn('id', $titleIds));
            }
            $titleNum += count($franchise->titles->whereIn('id', $titleIds));

            if ($titleNum > 1) {
                $groups[] = $games;
                $games = [];
            }

            foreach ($franchise->series as $series) {
                $prevId = null;
                foreach ($series->titles->whereIn('id', $titleIds) as $title) {
                    $games[] = (object)[
                        'title'       => $title,
                        'dom_id'      => $id . $title->id,
                        'node_name'   => $title->node_name,
                        'connections' => is_null($prevId) ? [] : [$prevId],
                    ];

                    $prevId = $id . $title->id;
                }
            }

            foreach ($franchise->titles->whereIn('id', $titleIds) as $title) {
                $games[] = (object)[
                    'title'       => $title,
                    'dom_id'      => $id . $title->id,
                    'node_name'   => $title->node_name,
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
            'platforms' => GamePlatform::select(['id', 'acronym'])->orderBy('sort_order')->get(),
            'groups' => $groups,
            'page'   => $page,
            'prev'   => array_merge($queries, ['page' => $prevPage]),
            'next'   => array_merge($queries, ['page' => $nextPage]),
            'search' => $search,
        ]));
    }

    public function makerNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $makers = GameMaker::select(['id', 'node_name'])->orderBy('phonetic')->get();

        return $this->network(view('game.maker_network', ['makers' => $makers]));
    }

    public function makerDetailNetwork(Request $request, GameMaker $maker): JsonResponse|Application|Factory|View
    {
        $packages = GamePackage::select(['id'])->where('game_maker_id', $maker->id)->get();
        $titleLinks = GameTitlePackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titles = GameTitle::whereIn('id', $titleLinks->pluck('game_title_id'))->get();

        return $this->network(view('game.maker_detail_network', [
            'maker'  => $maker,
            'titles' => $titles,
        ]));
    }

    public function platformNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $platforms = GamePlatform::select(['id', 'node_name'])->orderBy('sort_order')->get();

        return $this->network(view('game.platform_network', ['platforms' => $platforms]));
    }

    public function platformDetailNetwork(Request $request, GamePlatform $platform): JsonResponse|Application|Factory|View
    {
        $packages = GamePackage::select(['id'])->where('game_platform_id', $platform->id)->get();
        $titleLinks = GameTitlePackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titles = GameTitle::whereIn('id', $titleLinks->pluck('game_title_id'))->get();

        return $this->network(view('game.platform_detail_network', [
            'platform'  => $platform,
            'titles' => $titles,
        ]));
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

    public function packageNetwork(Request $request, GamePackage $pkg): JsonResponse|Application|Factory|View
    {
        return $this->network(view('game.package_network', [
            'pkg'    => $pkg
        ]));
    }
}

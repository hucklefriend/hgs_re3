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
     * @throws \Throwable
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
                if (empty($titleIds)) {
                    $titleNum += $series->titles->count();
                } else {
                    $titleNum += $series->titles->whereIn('id', $titleIds)->count();
                }
            }
            if (empty($titleIds)) {
                $titleNum += $franchise->titles->count();
            } else {
                $titleNum += $franchise->titles->whereIn('id', $titleIds)->count();
            }

            if ($titleNum > 2) {
                $groups[] = $games;
                $games = [];
            }

            foreach ($franchise->series as $series) {
                $prevId = null;
                if (empty($titleIds)) {
                    $titles = $series->titles;
                } else {
                    $titles = $series->titles->whereIn('id', $titleIds);
                }

                foreach ($titles as $title) {
                    $games[] = (object)[
                        'title'       => $title,
                        'dom_id'      => $id . $title->id,
                        'node_name'   => $title->node_name,
                        'connections' => is_null($prevId) ? [] : [$prevId],
                    ];

                    $prevId = $id . $title->id;
                }
            }

            if (empty($titleIds)) {
                $titles = $franchise->titles;
            } else {
                $titles = $franchise->titles->whereIn('id', $titleIds);
            }
            foreach ($titles as $title) {
                $games[] = (object)[
                    'title'       => $title,
                    'dom_id'      => $id . $title->id,
                    'node_name'   => $title->node_name,
                    'connections' => [],
                ];
            }

            if ($titleNum > 2) {
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

    /**
     * メーカーネットワーク
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function makerNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $page = $request->get('page', 1);
        $num = GameMaker::count();
        $maxPage = ceil($num / self::ITEM_PER_PAGE);

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

        $makers = GameMaker::select(['id', 'key', 'node_name', \DB::raw('"n" as `sub_net`')])
            ->orderBy('phonetic')
            ->limit(self::ITEM_PER_PAGE)
            ->offset(($page - 1) * self::ITEM_PER_PAGE)
            ->get();

        // game_maker_idとcount(id)を取得
        GamePackage::whereIn('game_maker_id', $makers->pluck('id'))
            ->select(['game_maker_id', \DB::raw('count(id) as count')])
            ->groupBy('game_maker_id')
            ->get()
            ->each(function ($item) use ($makers) {
                $maker = $makers->where('id', $item->game_maker_id)->first();

                if ($item->count >= 10) {
                    $maker->sub_net = 'l';
                } else if ($item->count >= 5) {
                    $maker->sub_net = 'm';
                } else if ($item->count >= 1) {
                    $maker->sub_net = 's';
                }
            });

        $queries = [];

        return $this->network(view('game.maker_network', [
            'makers' => $makers,
            'page'   => $page,
            'prev'   => array_merge($queries, ['page' => $prevPage]),
            'next'   => array_merge($queries, ['page' => $nextPage]),
        ]));
    }

    /**
     * メーカー詳細ネットワーク
     *
     * @param Request $request
     * @param string $makerKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function makerDetailNetwork(Request $request, string $makerKey): JsonResponse|Application|Factory|View
    {
        $maker = GameMaker::findByKey($makerKey);

        $packages = GamePackage::select(['id'])->where('game_maker_id', $maker->id)->get();
        $titleLinks = GameTitlePackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titles = GameTitle::whereIn('id', $titleLinks->pluck('game_title_id'))->get();

        return $this->network(view('game.maker_detail_network', [
            'maker'  => $maker,
            'titles' => $titles,
        ]));
    }

    /**
     * プラットフォームネットワーク
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function platformNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $page = $request->get('page', 1);
        $num = GamePlatform::count();
        $maxPage = ceil($num / self::ITEM_PER_PAGE);

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

        $platforms = GamePlatform::select(['id', 'key', 'node_name', \DB::raw('"n" as `sub_net`')])
            ->orderBy('sort_order')
            ->limit(self::ITEM_PER_PAGE)
            ->offset(($page - 1) * self::ITEM_PER_PAGE)
            ->get();

        // game_maker_idとcount(id)を取得
        GamePackage::whereIn('game_platform_id', $platforms->pluck('id'))
            ->select(['game_platform_id', \DB::raw('count(id) as count')])
            ->groupBy('game_platform_id')
            ->get()
            ->each(function ($item) use ($platforms) {
                $platform = $platforms->where('id', $item->game_platform_id)->first();

                if ($item->count >= 30) {
                    $platform->sub_net = 'l';
                } else if ($item->count >= 15) {
                    $platform->sub_net = 'm';
                } else if ($item->count >= 1) {
                    $platform->sub_net = 's';
                }
            });

        $queries = [];

        return $this->network(view('game.platform_network', [
            'platforms' => $platforms,
            'page'   => $page,
            'prev'   => array_merge($queries, ['page' => $prevPage]),
            'next'   => array_merge($queries, ['page' => $nextPage]),
        ]));
    }

    /**
     * プラットフォームの詳細ネットワーク
     *
     * @param Request $request
     * @param string $platformKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function platformDetailNetwork(Request $request, string $platformKey): JsonResponse|Application|Factory|View
    {
        $platform = GamePlatform::findByKey($platformKey);

        $packages = GamePackage::select(['id'])->where('game_platform_id', $platform->id)->get();
        $titleLinks = GameTitlePackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titles = GameTitle::whereIn('id', $titleLinks->pluck('game_title_id'))->get();

        return $this->network(view('game.platform_detail_network', [
            'platform'  => $platform,
            'titles' => $titles,
        ]));
    }

    /**
     * フランチャイズのネットワーク
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function franchiseNetwork(Request $request): JsonResponse|Application|Factory|View
    {
        $page = $request->get('page', 1);
        $num = GameFranchise::count();
        $maxPage = ceil($num / self::ITEM_PER_PAGE);

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

        $franchises = GameFranchise::select(['id', 'key', 'node_name', \DB::raw('"n" as `sub_net`')])
            ->orderBy('phonetic')
            ->limit(self::ITEM_PER_PAGE)
            ->offset(($page - 1) * self::ITEM_PER_PAGE)
            ->get()
            ->each(function ($franchise) {
                $titleNum = 0;
                foreach ($franchise->series as $series) {
                    if (empty($titleIds)) {
                        $titleNum += $series->titles->count();
                    } else {
                        $titleNum += $series->titles->whereIn('id', $titleIds)->count();
                    }
                }
                if (empty($titleIds)) {
                    $titleNum += $franchise->titles->count();
                } else {
                    $titleNum += $franchise->titles->whereIn('id', $titleIds)->count();
                }

                if ($titleNum >= 10) {
                    $franchise->sub_net = 'l';
                } else if ($titleNum >= 5) {
                    $franchise->sub_net = 'm';
                } else if ($titleNum >= 1) {
                    $franchise->sub_net = 's';
                }

                // レビュー、お気に入りユーザー数なども加味してゆく
            });


        return $this->network(view('game.franchise_network', [
            'franchises' => $franchises,
            'page'   => $page,
            'prev'   => ['page' => $prevPage],
            'next'   => ['page' => $nextPage],
        ]));
    }

    /**
     * フランチャイズの詳細ネットワーク
     *
     * @param Request $request
     * @param string $franchiseKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function franchiseDetailNetwork(Request $request, string $franchiseKey): JsonResponse|Application|Factory|View
    {
        $franchise = GameFranchise::findByKey($franchiseKey);
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

    /**
     * タイトルの詳細ネットワーク
     *
     * @param Request $request
     * @param string $titleKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function titleDetailNetwork(Request $request, string $titleKey): JsonResponse|Application|Factory|View
    {
        $title = GameTitle::findByKey($titleKey);

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

<?php

namespace App\Http\Controllers;

use App\Models\GameFranchise;
use App\Models\GameMaker;
use App\Models\GameMakerPackageLink;
use App\Models\GameMediaMix;
use App\Models\GamePackage;
use App\Models\GamePlatform;
use App\Models\GameSeries;
use App\Models\GameTitle;
use App\Models\GameTitlePackageLink;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameController extends Controller
{
    const ITEM_PER_PAGE = 50;

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
        $titleIds = new \Illuminate\Support\Collection();
        if (!empty($platforms)) {
            $queries['p'] = $platforms;
            $platforms = explode(',', $platforms);
            $search['p'] = $platforms;
            $packages = GamePackage::select(['id'])->whereIn('game_platform_id', $platforms)->get()->pluck('id');
            $titles = GameTitlePackageLink::whereIn('game_package_id', $packages)->distinct()->get()->pluck('game_title_id');
            $series = GameTitle::whereIn('id', $titles)->distinct()->pluck('game_series_id');
            $franchisesBySeries = GameSeries::whereIn('id', $series)->distinct()->pluck('game_franchise_id');
            $franchisesByTitle = GameTitle::whereIn('id', $titles)->distinct()->pluck('game_franchise_id');
            $linkedFranchiseIds = $franchisesBySeries->merge($franchisesByTitle)->unique();
            $franchisesQuery->whereIn('id', $linkedFranchiseIds);

            $titleIds = $titles;
        }

        $ratings = $request->get('r', '');
        if (!empty($ratings)) {
            $queries['r'] = $ratings;
            $ratings = explode(',', $ratings);
            $search['r'] = $ratings;
            $packages = GamePackage::select(['id'])->whereIn('rating', $ratings)->get()->pluck('id');
            $titles = GameTitlePackageLink::whereIn('game_package_id', $packages->toArray())->distinct()->get()->pluck('game_title_id');
            $titleIds = $titleIds->concat($titles->toArray());
            $franchisesByTitle = GameTitle::whereIn('id', $titleIds)->distinct()->pluck('game_franchise_id');
            $franchisesQuery->whereIn('id', $franchisesByTitle->unique());
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

            $prevTitleNumInSeries = 0;
            foreach ($franchise->series as $series) {
                if ($titleIds->isEmpty()) {
                    $titles = $series->titles;
                } else {
                    $titles = $series->titles->whereIn('id', $titleIds);
                }

                $titleNumInSeries = $titles->count();
                if ($titleNumInSeries >= 2 && !empty($games)) {
                    $groups[] = $games;
                    $games = [];
                }

                $prevId = null;

                foreach ($titles as $title) {
                    $games[] = (object)[
                        'title'       => $title,
                        'dom_id'      => $id . $title->id,
                        'node_name'   => $title->node_name,
                        'connections' => is_null($prevId) ? [] : [$prevId],
                    ];

                    $prevId = $id . $title->id;
                }

                if ($titleNumInSeries >= 2 || $prevTitleNumInSeries >= 2) {
                    $groups[] = $games;
                    $games = [];
                }

                $prevTitleNumInSeries = $titleNumInSeries;
            }

            if ($titleIds->isEmpty()) {
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
        }
        if (count($games) > 0) {
            $groups[] = $games;
        }

        return $this->network(view('game.horrorgame_network', [
            'platforms' => GamePlatform::select(['id', 'name'])->orderBy('sort_order')->get(),
            'groups'    => $groups,
            'page'      => $page,
            'prev'      => array_merge($queries, ['page' => $prevPage]),
            'next'      => array_merge($queries, ['page' => $nextPage]),
            'search'    => $search
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
        $makers = GameMaker::select(['id', 'key', 'node_name', \DB::raw('"n" as `sub_net`')])
            ->whereNull('related_game_maker_id')
            ->orderBy('name')
            ->paginate(self::ITEM_PER_PAGE);

        // game_maker_idと紐づくパッケージの数を検索
        GameMakerPackageLink::whereIn('game_maker_id', $makers->getCollection()->pluck('id'))
            ->select(['game_maker_id', \DB::raw('count(game_maker_id) as count')])
            ->groupBy('game_maker_id')
            ->get()
            ->each(function ($item) use ($makers) {
                $maker = $makers->getCollection()->where('id', $item->game_maker_id)->first();

                if ($item->count >= 30) {
                    $maker->sub_net = 'l';
                } else if ($item->count >= 10) {
                    $maker->sub_net = 'm';
                } else if ($item->count >= 1) {
                    $maker->sub_net = 's';
                }
            });

        return $this->network(view('game.maker_network', compact('makers')));
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

        $packages = $maker->packages();
        $titleLinks = GameTitlePackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titles = GameTitle::whereIn('id', $titleLinks->pluck('game_title_id'))->get();

        return $this->network(view('game.maker_detail_network', [
            'maker'  => $maker,
            'titles' => $titles,
            'footerLinks' => [
                'Maker' => route('Game.MakerNetwork'),
            ]
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
        $platforms = GamePlatform::select(['id', 'key', 'node_name', \DB::raw('"n" as `sub_net`')])
            ->orderBy('sort_order')
            ->paginate(self::ITEM_PER_PAGE);

        // game_maker_idとcount(id)を取得
        GamePackage::whereIn('game_platform_id', $platforms->getCollection()->pluck('id'))
            ->select(['game_platform_id', \DB::raw('count(id) as count')])
            ->groupBy('game_platform_id')
            ->get()
            ->each(function ($item) use ($platforms) {
                $platform = $platforms->getCollection()->where('id', $item->game_platform_id)->first();

                if ($item->count >= 30) {
                    $platform->sub_net = 'l';
                } else if ($item->count >= 15) {
                    $platform->sub_net = 'm';
                } else if ($item->count >= 1) {
                    $platform->sub_net = 's';
                }
            });

        return $this->network(view('game.platform_network', compact('platforms')));
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
            'platform'    => $platform,
            'titles'      => $titles,
            'footerLinks' => [
                'Platform' => route('Game.PlatformNetwork'),
            ],
        ]));
    }

    /**
     * フランチャイズのネットワーク
     *
     * @param Request $request
     * @param string $prefix
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function franchiseNetwork(Request $request, string $prefix = 'a'): JsonResponse|Application|Factory|View
    {
        if (preg_match('/^[akstnhmr]$/', $prefix) !== 1) {
            $prefix = 'a';
        }

        $like = match($prefix) {
            'k' => ['か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご'],
            's' => ['さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
            't' => ['た', 'ち', 'つ', 'て', 'と', 'だ', 'ぢ', 'づ', 'で', 'ど'],
            'n' => ['な', 'に', 'ぬ', 'ね', 'の'],
            'h' => ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
            'm' => ['ま', 'み', 'む', 'め', 'も'],
            'y' => ['や', 'よ', 'ゆ'],
            'r' => ['ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'],
            default => ['あ', 'い', 'う', 'え', 'お'],
        };

        $franchises = GameFranchise::select(['id', 'key', 'node_name', \DB::raw('"n" as `sub_net`')]);
        foreach ($like as $word) {
            $franchises->orWhere('phonetic', 'like', $word . '%');
        }

        $franchises = $franchises->orderBy('phonetic');

        // フランチャイズに紐づくタイトル数を取得
        $franchises = $franchises->get();

        $franchises->each(function ($franchise) {
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


        return $this->network(view('game.franchise_network', compact('franchises')));
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
            'franchise'   => $franchise,
            'titles'      => $titles,
            'footerLinks' => [
                'Franchise' => route('Game.FranchiseNetwork'),
            ],
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

        $packages = $title->packages->sortBy('release_at');
        $makers = [];
        foreach ($packages as $package) {
            foreach ($package->makers as $maker) {
                $makers[$maker->id] = $maker;
            }
        }

        return $this->network(view('game.title_detail_network', [
            'title'    => $title,
            'packages' => $packages,
            'makers'   => $makers,
        ]));
    }

    /**
     * メディアミックスの詳細ネットワーク
     *
     * @param Request $request
     * @param string $mediaMixKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function mediaMixDetailNetwork(Request $request, string $mediaMixKey): JsonResponse|Application|Factory|View
    {
        $mediaMix = GameMediaMix::findByKey($mediaMixKey);

        $relatedNetworks = [];
        if ($mediaMix->mediaMixGroup !== null) {
            foreach ($mediaMix->mediaMixGroup->mediaMixes as $relatedMediaMix) {
                if ($relatedMediaMix->id === $mediaMix->id) {
                    continue;
                }
                $relatedNetworks[] = $relatedMediaMix;
            }
        }

        return $this->network(view('game.media_mix_detail_network', [
            'mediaMix' => $mediaMix,
            'relatedNetworks' => $relatedNetworks,
        ]));
    }
}

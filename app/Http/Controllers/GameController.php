<?php

namespace App\Http\Controllers;

use App\Enums\Rating;
use App\Models\GameFranchise;
use App\Models\GameMaker;
use App\Models\GameMakerPackageLink;
use App\Models\GameMediaMix;
use App\Models\GamePackage;
use App\Models\GamePlatform;
use App\Models\GameTitle;
use App\Models\GameTitlePackageLink;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        $json = Storage::get('public/main.json');

        return $this->map(view('game.horrorgame_network'), $json);
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

        return $this->document(view('game.maker_network', compact('makers')));
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

        return $this->document(view('game.maker_detail_network', [
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

        return $this->document(view('game.platform_network', compact('platforms')));
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

        return $this->document(view('game.platform_detail_network', [
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
        if (preg_match('/^[akstnhmry]$/', $prefix) !== 1) {
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


        return $this->document(view('game.franchise_network', compact('franchises')));
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

        return $this->document(view('game.franchise_detail_network', [
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

        $ratingCheck = $title->rating != Rating::None;

        return $this->document(view('game.title_detail_network', compact('title', 'packages', 'makers', 'ratingCheck')), $ratingCheck);
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

        return $this->document(view('game.media_mix_detail_network', [
            'mediaMix' => $mediaMix,
            'relatedNetworks' => $relatedNetworks,
        ]));
    }
}

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
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    const ITEM_PER_PAGE = 50;

    /**
     * ホラーゲーム
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function horrorGames(Request $request): JsonResponse|Application|Factory|View
    {
        return $this->tree(view('horror_games'));
    }

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

        return $this->map(view('game.horrorgame_network'), $json, ['hgs' => 'horror-game-search']);
    }

    /**
     * ホラーゲームの検索
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function searchHorrorGame(Request $request): JsonResponse
    {
        $text = $request->input('text');

        $franchises = GameFranchise::select(['id', 'key', 'name'])
            ->where('name', 'like', '%' . $text . '%')
            ->get()
            ->toArray();
        $titles = GameTitle::select(['id', 'key', 'name'])
            ->where('name', 'like', '%' . $text . '%')
            ->get()
            ->toArray();

        return response()->json([
            'franchises' => $franchises,
            'titles' => $titles,
        ]);
    }

    /**
     * メーカーネットワーク
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function maker(Request $request): JsonResponse|Application|Factory|View
    {
        $makers = GameMaker::select(['id', 'key', 'name'])
            ->whereNull('related_game_maker_id')
            ->orderBy('name')
            ->get();

        return $this->tree(view('game.maker', compact('makers')));
    }

    /**
     * メーカー詳細ネットワーク
     *
     * @param Request $request
     * @param string $makerKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function makerDetail(Request $request, string $makerKey): JsonResponse|Application|Factory|View
    {
        $maker = GameMaker::findByKey($makerKey);

        $packages = $maker->packages();
        $titleLinks = GameTitlePackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titles = GameTitle::whereIn('id', $titleLinks->pluck('game_title_id'))->get();

        return $this->tree(view('game.maker_detail', [
            'maker'  => $maker,
            'titles' => $titles,
        ]));
    }

    /**
     * プラットフォーム
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function platform(Request $request): JsonResponse|Application|Factory|View
    {
        $platforms = GamePlatform::select(['id', 'key', 'name'])
            ->orderBy('sort_order')
            ->get();

        return $this->tree(view('game.platform', compact('platforms')));
    }

    /**
     * プラットフォームの詳細
     *
     * @param Request $request
     * @param string $platformKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function platformDetail(Request $request, string $platformKey): JsonResponse|Application|Factory|View
    {
        $platform = GamePlatform::findByKey($platformKey);

        $packages = GamePackage::select(['id'])->where('game_platform_id', $platform->id)->get();
        $titleLinks = GameTitlePackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titles = GameTitle::whereIn('id', $titleLinks->pluck('game_title_id'))->get();

        return $this->tree(view('game.platform_detail', [
            'platform'    => $platform,
            'titles'      => $titles
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
    public function franchises(Request $request, string $prefix = 'a'): JsonResponse|Application|Factory|View
    {
        if (preg_match('/^[akstnhmry]$/', $prefix) !== 1) {
            $prefix = 'a';
        }

        $prefixes =[
            'a' => ['あ', 'い', 'う', 'え', 'お'],
            'k' => ['か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご'],
            's' => ['さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
            't' => ['た', 'ち', 'つ', 'て', 'と', 'だ', 'ぢ', 'づ', 'で', 'ど'],
            'n' => ['な', 'に', 'ぬ', 'ね', 'の'],
            'h' => ['は', 'ひ', 'ふ', 'へ', 'ほ', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
            'm' => ['ま', 'み', 'む', 'め', 'も'],
            'y' => ['や', 'よ', 'ゆ'],
            'r' => ['ら', 'り', 'る', 'れ', 'ろ', 'わ', 'を', 'ん'],
        ];

        $franchisesByPrefix = [];
        foreach ($prefixes as $prefix => $words) {
            $model = GameFranchise::select(['id', 'key', 'name', 'description']);
            foreach ($words as $word) {
                $model->orWhere('phonetic', 'like', $word . '%');
            }
    
            $franchisesByPrefix[$prefix] = $model->orderBy('phonetic')->get();
        }

        return $this->tree(view('game.franchises', compact('prefixes', 'franchisesByPrefix')));
    }

    /**
     * フランチャイズの詳細ネットワーク
     *
     * @param Request $request
     * @param string $franchiseKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function franchiseDetail(Request $request, string $franchiseKey): JsonResponse|Application|Factory|View
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

        return $this->tree(view('game.franchise_detail', [
            'franchise'   => $franchise,
            'titles'      => $titles,
        ]));
    }

    /**
     * タイトルの詳細
     *
     * @param Request $request
     * @param string $titleKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function titleDetail(Request $request, string $titleKey): JsonResponse|Application|Factory|View
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
        $franchise = $title->getFranchise();

        return $this->tree(view('game.title_detail', compact('title', 'packages', 'makers', 'ratingCheck', 'franchise')), $ratingCheck);
    }

    /**
     * メディアミックスの詳細ネットワーク
     *
     * @param Request $request
     * @param string $mediaMixKey
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function mediaMixDetail(Request $request, string $mediaMixKey): JsonResponse|Application|Factory|View
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

        return $this->tree(view('game.media_mix_detail', [
            'mediaMix' => $mediaMix,
            'relatedNetworks' => $relatedNetworks,
        ]));
    }
}

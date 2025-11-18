<?php

namespace App\Http\Controllers;

use App\Enums\Rating;
use App\Models\GameFranchise;
use App\Models\GameMaker;
use App\Models\GameMediaMix;
use App\Models\GamePackage;
use App\Models\GamePackageGroupPackageLink;
use App\Models\GameTitlePackageGroupLink;
use App\Models\GamePlatform;
use App\Models\GameSeries;
use App\Models\GameTitle;
use App\Models\UserFavoriteGameTitle;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GameController extends Controller
{
    const ITEM_PER_PAGE = 50;

    /**
     * ホラーゲームの検索
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View
     */
    public function search(Request $request): JsonResponse|Application|Factory|View
    {
        $text = $request->input('text', '');

        if (empty($text)) {
            return $this->tree(view('game.search', compact('text')));
        }

        $titles = GameTitle::select(['id', 'key', 'name', 'game_series_id', 'game_franchise_id', 'rating'])
            ->where('name', 'like', '%' . $text . '%')
            ->get();

        // series_idがnullでないものを取得
        $seriesIds = $titles->whereNotNull('game_series_id')
            ->unique('game_series_id')
            ->pluck('game_series_id')
            ->toArray();

        // seriesを取得
        $series = GameSeries::whereIn('id', $seriesIds)->get();

        $franchiseIds = $series->pluck('game_franchise_id')
            ->unique('game_franchise_id')
            ->toArray();

        $franchiseIds = array_merge($franchiseIds, 
            $titles->whereNotNull('game_franchise_id')
                ->pluck('game_franchise_id')
                ->unique('game_franchise_id')
                ->toArray()
        );

        // franchiseを取得
        $franchises = GameFranchise::whereIn('id', $franchiseIds)->get();

        // franchiseに$seriesと$titlesInFranchiseを紐づけ
        foreach ($franchises as $franchise) {
            $franchise->series = $series->where('game_franchise_id', $franchise->id);
            $franchise->titles = $titles->where('game_franchise_id', $franchise->id);
        }

        return $this->tree(view('game.search', compact('text', 'franchises', 'franchiseIds', 'series', 'titles')));
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
        $makers = GameMaker::select()
            ->whereNull('related_game_maker_id')
            ->orderBy('name')
            ->get();

        return $this->tree(view('game.makers', compact('makers')));
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
        $packageGroups = GamePackageGroupPackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titleIds = GameTitlePackageGroupLink::whereIn('game_package_group_id', $packageGroups->pluck('game_package_group_id')->unique())->pluck('game_title_id');
        $titles = GameTitle::whereIn('id', $titleIds)->get();

        $ratingCheck = $titles->where('rating', Rating::R18A)->count() > 0;

        return $this->tree(view('game.maker_detail', [
            'maker'  => $maker,
            'titles' => $titles,
        ]), $ratingCheck);
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
        $platforms = GamePlatform::select()
            ->orderBy('sort_order')
            ->get();

        return $this->tree(view('game.platforms', compact('platforms')));
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
        $packageGroups = GamePackageGroupPackageLink::whereIn('game_package_id', $packages->pluck('id'))->get();
        $titleIds = GameTitlePackageGroupLink::whereIn('game_package_group_id', $packageGroups->pluck('game_package_group_id')->unique())->pluck('game_title_id');
        $titles = GameTitle::whereIn('id', $titleIds)->get();

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
            $model = GameFranchise::select(['id', 'key', 'name', 'description', 'rating']);
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
        $ratingCheck = false;
        $titles = [];
        foreach ($franchise->series as $series) {
            foreach ($series->titles as $title) {
                $titles[] = $title;
                if ($title->rating == Rating::R18A) {
                    $ratingCheck = true;
                }
            }
        }
        foreach ($franchise->titles as $title) {
            $titles[] = $title;
            if ($title->rating == Rating::R18A) {
                $ratingCheck = true;
            }
        }

        return $this->tree(view('game.franchise_detail', [
            'franchise'   => $franchise,
            'titles'      => $titles,
        ]), $ratingCheck);
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

        $ratingCheck = $title->rating == Rating::R18A;
        $franchise = $title->getFranchise();

        // ログイン状態ならお気に入りに入っているか確認
        $isFavorite = false;
        if (Auth::check()) {
            $isFavorite = UserFavoriteGameTitle::where('user_id', Auth::id())
                ->where('game_title_id', $title->id)
                ->exists();
        }

        return $this->tree(view('game.title_detail', compact('title', 'ratingCheck', 'franchise', 'isFavorite')), $ratingCheck);
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
        ]), $mediaMix->rating == Rating::R18A);
    }
}

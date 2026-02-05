<?php

namespace App\Http\Controllers\User;

use Carbon\Carbon;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\FearMeterStoreRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\GameTitle;
use App\Models\GameTitleFearMeterStatistic;
use App\Models\UserGameTitleFearMeter;

class FearMeterController extends Controller
{
    /**
     * 怖さメーター入力画面表示
     *
     * @param string $titleKey
     * @return JsonResponse|Application|Factory|View
     */
    public function form(string $titleKey): JsonResponse|Application|Factory|View
    {
        $title = GameTitle::findByKey($titleKey);
        if (!$title) {
            abort(404);
        }

        $user = Auth::user();
        $fearMeter = UserGameTitleFearMeter::where('user_id', $user->id)
            ->where('game_title_id', $title->id)
            ->first();

        return $this->tree(
            view('user.fear_meter.form', compact('user', 'title', 'fearMeter')), 
            options: [
                'csrfToken' => csrf_token(),
            ]
        );
    }

    /**
     * 怖さメーターを保存
     *
     * @param FearMeterStoreRequest $request
     * @return JsonResponse
     */
    public function store(FearMeterStoreRequest $request): JsonResponse
    {
        $user = Auth::user();
        $title = GameTitle::findByKey($request->validated('title_key'));

        UserGameTitleFearMeter::updateOrCreate(
            [
                'user_id' => $user->id,
                'game_title_id' => $title->id,
            ],
            [
                'fear_meter' => $request->validated('fear_meter'),
            ]
        );

        $statistic = GameTitleFearMeterStatistic::firstOrNew(['game_title_id' => $title->id]);
        $statistic->game_title_id = $title->id;
        $statistic->recalculate();

        return response()->json(['success' => true]);
    }
}


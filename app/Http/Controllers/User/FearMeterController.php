<?php

namespace App\Http\Controllers\User;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\FearMeterStoreRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\GameTitle;
use App\Models\UserGameTitleFearMeter;
use App\Models\UserGameTitleFearMeterLog;
use Illuminate\Http\RedirectResponse;

class FearMeterController extends Controller
{
    /**
     * 怖さメーター一覧表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function index(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $fearMeters = UserGameTitleFearMeter::where('user_id', $user->id)
            ->with('gameTitle')
            ->orderBy('updated_at', 'desc')
            ->paginate(30);

        return $this->tree(
            view('user.fear_meter.index', compact('fearMeters')),
            options: [
                'url' => route('User.FearMeter.Index'),
            ]
        );
    }

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

        $franchise = $title->getFranchise();
        $shortcutRoute = [
            'title-detail-node' => [
                'title' => $title->name,
                'url' => route('Game.TitleDetail', ['titleKey' => $title->key]),
                'children' => [
                    'franchise-detail-node' => [
                        'title' => $franchise->name . "フランチャイズ",
                        'url' => route('Game.FranchiseDetail', ['franchiseKey' => $franchise->key]),
                        'children' => [
                            'root-node' => [
                                'title' => 'トップ',
                                'url' => route('Root'),
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $myNodeShortcutRoute = [
            'fear-meter-list-node' => [
                'title' => '怖さメーター一覧',
                'url' => route('User.FearMeter.Index'),
                'children' => [
                    'mynode' => [
                        'title' => 'マイノード',
                        'url' => route('User.MyNode.Top'),
                    ],
                ],
            ],
        ];

        return $this->tree(
            view('user.fear_meter.form', compact('user', 'title', 'fearMeter', 'shortcutRoute', 'myNodeShortcutRoute')), 
            options: [
                'csrfToken' => csrf_token(),
                'url' => route('User.FearMeter.Form', ['titleKey' => $title->key]),
            ]
        );
    }

    /**
     * 怖さメーターを保存
     *
     * @param FearMeterStoreRequest $request
     * @return RedirectResponse
     */
    public function store(FearMeterStoreRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $title = GameTitle::findByKey($request->validated('title_key'));
        $newFearMeter = (int) $request->validated('fear_meter');

        $fearMeter = UserGameTitleFearMeter::firstOrNew([
            'user_id' => $user->id,
            'game_title_id' => $title->id,
        ]);
        $oldFearMeter = $fearMeter->exists ? $fearMeter->fear_meter->value : null;
        if ($fearMeter->exists) {
            UserGameTitleFearMeter::where('user_id', $user->id)
                ->where('game_title_id', $title->id)
                ->update(['fear_meter' => $newFearMeter]);
        } else {
            $fearMeter->fear_meter = $newFearMeter;
            $fearMeter->save();
        }

        UserGameTitleFearMeterLog::create([
            'user_id' => $user->id,
            'game_title_id' => $title->id,
            'old_fear_meter' => $oldFearMeter,
            'new_fear_meter' => $newFearMeter,
        ]);

        return redirect()->route('User.FearMeter.Form', ['titleKey' => $title->key])
            ->with('success', "怖さメーターを登録しました。\r\nゲームタイトルへの反映はしばらく時間がかかります。\r\n時間をおいてから再度ご確認ください。");
    }
}


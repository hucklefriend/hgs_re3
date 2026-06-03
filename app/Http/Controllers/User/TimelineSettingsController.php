<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\TimelineSettingsUpdateRequest;
use App\Models\UserTimelineSetting;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class TimelineSettingsController extends Controller
{
    /**
     * タイムライン設定画面表示
     */
    public function show(): JsonResponse|Application|Factory|View
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $setting = UserTimelineSetting::forUser($user->id);

        return $this->tree(view('user.my_node.timeline_settings', compact('setting')));
    }

    /**
     * マイノードタイムライン設定の更新
     */
    public function updateMyNode(TimelineSettingsUpdateRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $validated = $request->validated();

        $setting = UserTimelineSetting::firstOrNew(['user_id' => $user->id]);
        $setting->show_horror_keyword_rss     = (bool) ($validated['show_horror_keyword_rss'] ?? false);
        $setting->show_favorite_franchise_rss = (bool) ($validated['show_favorite_franchise_rss'] ?? false);
        $setting->show_followed_user_activity = (bool) ($validated['show_followed_user_activity'] ?? false);
        $setting->save();

        return redirect()->route('User.MyNode.TimelineSettings')->with('success', 'マイノードタイムラインの設定を更新しました。');
    }

    /**
     * ルートタイムライン設定の更新
     */
    public function updateRoot(TimelineSettingsUpdateRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $validated = $request->validated();

        $setting = UserTimelineSetting::firstOrNew(['user_id' => $user->id]);
        $setting->publish_activity_to_root = (bool) ($validated['publish_activity_to_root'] ?? false);
        $setting->save();

        return redirect()->route('User.MyNode.TimelineSettings')->with('success', 'ルートタイムラインの設定を更新しました。');
    }
}

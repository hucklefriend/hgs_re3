<?php

namespace App\Http\Controllers;

use App\Models\Information;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\App;
use App\Notifications\TestFailedNotification;
use Illuminate\Support\Facades\Notification;

class HgnController extends Controller
{
    /**
     * トップページ
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function root(): JsonResponse|Application|Factory|View
    {
        if (App::environment('production')) {
            return view('suspend');
        }

        $infoList = Information::where('open_at', '<', now())
            ->where('close_at', '>=', now())
            ->orderBy('priority', 'desc')
            ->orderBy('open_at', 'desc')
            ->get();

        return $this->tree(view('root', compact('infoList')));
    }

    /**
     * お知らせネットワーク
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function infoNetwork(): JsonResponse|Application|Factory|View
    {
        $infoList = Information::where('open_at', '<=', now())
            ->orderBy('open_at', 'desc')
            ->paginate(30);

        return $this->document(view('info_network', compact('infoList')));
    }

    /**
     * お知らせ
     *
     * @param Information $info
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function info(Information $info): JsonResponse|Application|Factory|View
    {
        return $this->contentNode(view('info', ['info' => $info]), function() {
            return $this->infoNetwork();
        });
    }

    /**
     * 当サイトについて
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function about(): JsonResponse|Application|Factory|View
    {
        return $this->tree(view('about'));
    }

    /**
     * プライバシーポリシー
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function privacyPolicy(): JsonResponse|Application|Factory|View
    {
        return $this->tree(view('privacy_policy'));
    }

    /**
     * 描画チェック
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function drawCheck(): JsonResponse|Application|Factory|View
    {
        if (App::environment('production')) {
            return view('suspend');
        }

        return $this->document(view('draw_check'));
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Information;
use App\Models\MasterData\GameFranchise;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class HgnController extends Controller
{
    /**
     * トップページ
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function entrance(): JsonResponse|Application|Factory|View
    {
        if (App::environment('production')) {
            return view('suspend');
        }

        $infoList = Information::where('open_at', '<', now())
            ->where('close_at', '>=', now())
            ->orderBy('priority', 'desc')
            ->orderBy('open_at', 'desc')
            ->get();

        return $this->network(view('entrance', compact('infoList')));
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

        return $this->network(view('info_network', compact('infoList')));
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
        return $this->contentNode(view('info', ['info' => $info]));
    }

    /**
     * 当サイトについて
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function about(): JsonResponse|Application|Factory|View
    {
        return $this->contentNode(view('about'));
    }

    /**
     * プライバシーポリシー
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function privacyPolicy(): JsonResponse|Application|Factory|View
    {
        return $this->contentNode(view('privacy_policy'));
    }
}

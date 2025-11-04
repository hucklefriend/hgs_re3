<?php

namespace App\Http\Controllers;

use App\Models\Information;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;

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
        $infoList = Information::select(['id', 'head'])
            ->where('open_at', '<', now())
            ->where('close_at', '>=', now())
            ->orderBy('priority', 'desc')
            ->orderBy('open_at', 'desc')
            ->limit(3)
            ->get();

        return $this->tree(view('root', compact('infoList')), url: route('Root'));
    }

    /**
     * お知らせ一覧
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function infomations(): JsonResponse|Application|Factory|View
    {
        $informations = Information::where('open_at', '<=', now())
            ->where('close_at', '>=', now())
            ->orderBy('priority', 'desc')
            ->orderBy('open_at', 'desc')
            ->get();

        return $this->tree(view('infomations', compact('informations')));
    }

    /**
     * お知らせ
     *
     * @param Information $info
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function infomationDetail(Information $info): JsonResponse|Application|Factory|View
    {
        return $this->tree(view('infomation_detail', compact('info')));
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
     * ロゴ
     *
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    public function logo(): JsonResponse|Application|Factory|View
    {
        return $this->tree(view('logo'));
    }
}

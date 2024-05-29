<?php

namespace App\Http\Controllers;

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

        return $this->network(view('entrance'));
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

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
     */
    public function index(): JsonResponse|Application|Factory|View
    {
        if (!App::environment('local')) {
            return view('suspend');
        }

        return $this->network('index');
    }

    public function lineup(): JsonResponse|Application|Factory|View
    {
        $franchises = GameFranchise::all(['id', 'name']);

        return $this->network('lineup', ['franchises' => $franchises]);
    }

    public function privacyPolicy(): JsonResponse|Application|Factory|View
    {
        return $this->contentNode('privacy_policy');
    }
}

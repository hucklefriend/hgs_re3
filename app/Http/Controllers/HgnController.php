<?php

namespace App\Http\Controllers;

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
     * @return Application|Factory|View
     */
    public function index(): Application|Factory|View
    {
        if (!App::environment('local')) {
            return view('suspend');
        }

        return view('index');
    }

    public function privacyPolicy(Request $request): JsonResponse|Application|Factory|View
    {
        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにテキストを返す
        if ($request->ajax()) {
            $rendered = \Illuminate\Support\Facades\View::make('privacy_policy')->renderSections();
            return response()->json([
                'title'  => $rendered['content-node-title'],
                'body'   => $rendered['content-node-body'],
                'footer' => $rendered['content-node-footer'] ?? '',
            ]);
        }

        return view('privacy_policy');
    }
}

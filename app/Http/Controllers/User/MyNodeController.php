<?php

namespace App\Http\Controllers\User;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class MyNodeController extends Controller
{
    /**
     * マイページトップ表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function top(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        
        return $this->tree(view('user.my_node.top', compact('user')));
    }
}


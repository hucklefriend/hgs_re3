<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    /**
     * お気に入りタイトル一覧
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function favoriteTitles(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $favoriteTitles = $user->favoriteGameTitles()->orderBy('created_at', 'desc')->get();

        return $this->tree(view('user.follow.favorite_titles', compact('favoriteTitles')), options: ['url' => route('User.Follow.FavoriteTitles')]);
    }
}


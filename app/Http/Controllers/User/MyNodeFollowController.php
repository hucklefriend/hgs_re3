<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Support\Pager;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MyNodeFollowController extends Controller
{
    private const PER_PAGE = 20;

    public function following(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $following = $user->following()->orderByPivot('created_at', 'desc')->paginate(self::PER_PAGE);
        $pager = new Pager($following->currentPage(), $following->lastPage(), 'User.MyNode.Following', []);

        return $this->tree(
            view('user.my_node.following', compact('following', 'pager')),
            options: ['url' => route('User.MyNode.Following'), 'components' => ['UserRelation' => null]]
        );
    }

    public function followers(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $followers = $user->followers()->orderByPivot('created_at', 'desc')->paginate(self::PER_PAGE);
        $pager = new Pager($followers->currentPage(), $followers->lastPage(), 'User.MyNode.Followers', []);

        return $this->tree(
            view('user.my_node.followers', compact('followers', 'pager')),
            options: ['url' => route('User.MyNode.Followers'), 'components' => ['UserRelation' => null]]
        );
    }

    public function blocking(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $blocking = $user->blocking()->orderByPivot('created_at', 'desc')->paginate(self::PER_PAGE);
        $pager = new Pager($blocking->currentPage(), $blocking->lastPage(), 'User.MyNode.Blocking', []);

        return $this->tree(
            view('user.my_node.blocking', compact('blocking', 'pager')),
            options: ['url' => route('User.MyNode.Blocking'), 'components' => ['UserRelation' => null]]
        );
    }

    public function muting(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $muting = $user->muting()->orderByPivot('created_at', 'desc')->paginate(self::PER_PAGE);
        $pager = new Pager($muting->currentPage(), $muting->lastPage(), 'User.MyNode.Muting', []);

        return $this->tree(
            view('user.my_node.muting', compact('muting', 'pager')),
            options: ['url' => route('User.MyNode.Muting'), 'components' => ['UserRelation' => null]]
        );
    }
}

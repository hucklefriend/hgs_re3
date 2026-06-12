<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserGameTitleFearMeter;
use App\Models\UserGameTitleFearMeterLog;
use App\Models\UserGameTitleReview;
use App\Services\Timeline\TimelineEventService;
use App\Support\Pager;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    private const PER_PAGE = 20;
    private const ACTIVITY_PREVIEW_LIMIT = 5;

    public function __construct(private readonly TimelineEventService $timelineEventService)
    {
    }

    private function findUser(string $showId): User
    {
        return User::where('show_id', $showId)->whereNull('withdrawn_at')->firstOrFail();
    }

    public function show(string $showId): JsonResponse|Application|Factory|View
    {
        $profileUser = $this->findUser($showId);

        /** @var User|null $me */
        $me = Auth::user();
        $isBlocked = $me && $me->isBlockedBy($profileUser);
        $isSelf    = $me && $me->id === $profileUser->id;

        $isFollowing = !$isBlocked && $me && $me->isFollowing($profileUser);
        $isBlocking  = $me && $me->isBlocking($profileUser);
        $isMuting    = $me && $me->isMuting($profileUser);

        $favoriteTitles  = $profileUser->favoriteGameTitles()->orderBy('user_favorite_game_titles.created_at', 'desc')->limit(5)->get();
        $fearMeterCount  = UserGameTitleFearMeter::where('user_id', $profileUser->id)->count();
        $reviewCount     = UserGameTitleReview::where('user_id', $profileUser->id)->where('is_deleted', false)->where('is_hidden', false)->count();
        $followingCount  = $profileUser->following()->count();
        $followerCount   = $profileUser->followers()->count();

        $recentActivity = $isBlocked ? [] : $this->timelineEventService->fetchForProfileUser($profileUser->id, self::ACTIVITY_PREVIEW_LIMIT);

        $components = [];
        if (!$isSelf && !$isBlocked && $me) {
            $components['UserRelation'] = [
                'showId'    => $showId,
                'following' => $isFollowing,
                'blocking'  => $isBlocking,
                'muting'    => $isMuting,
            ];
        }

        return $this->tree(
            view('user.profile.show', compact(
                'profileUser', 'me', 'isBlocked', 'isFollowing', 'isBlocking', 'isMuting', 'isSelf',
                'favoriteTitles', 'fearMeterCount', 'reviewCount', 'followingCount', 'followerCount',
                'recentActivity'
            )),
            options: ['url' => route('User.Profile.Show', ['show_id' => $showId]), 'components' => $components]
        );
    }

    public function timeline(string $showId): JsonResponse|Application|Factory|View
    {
        $profileUser = $this->findUser($showId);
        $me = Auth::user();
        $isBlocked = $me && $me->isBlockedBy($profileUser);

        $paginator = $isBlocked ? null : $this->timelineEventService->fetchForProfileUserPaginated($profileUser->id, self::PER_PAGE);

        $pager = null;
        if ($paginator) {
            $pager = new Pager(
                $paginator->currentPage(),
                $paginator->lastPage(),
                'User.Profile.Timeline',
                ['show_id' => $showId],
                'children'
            );
        }

        return $this->tree(
            view('user.profile.timeline', compact('profileUser', 'isBlocked', 'paginator', 'pager')),
            options: ['url' => route('User.Profile.Timeline', ['show_id' => $showId])]
        );
    }

    public function fearMeters(string $showId): JsonResponse|Application|Factory|View
    {
        $profileUser = $this->findUser($showId);
        $me = Auth::user();
        $isBlocked = $me && $me->isBlockedBy($profileUser);

        $fearMeters = UserGameTitleFearMeter::where('user_id', $profileUser->id)
            ->with('gameTitle')
            ->orderByDesc('updated_at')
            ->paginate(self::PER_PAGE);

        $fearMeterComments = UserGameTitleFearMeterLog::where('user_id', $profileUser->id)
            ->whereIn('game_title_id', $fearMeters->pluck('game_title_id'))
            ->where('is_deleted', false)
            ->orderByDesc('id')
            ->get()
            ->unique('game_title_id')
            ->keyBy('game_title_id');

        $shortcutRoute = [
            'profile-node' => [
                'title'    => $profileUser->name . 'さんのプロフィール',
                'url'      => route('User.Profile.Show', ['show_id' => $showId]),
                'children' => [
                    'root-node' => [
                        'title' => 'ルート',
                        'url'   => route('Root'),
                    ],
                ],
            ],
        ];

        $pager = new Pager(
            $fearMeters->currentPage(),
            $fearMeters->lastPage(),
            'User.Profile.FearMeters',
            ['show_id' => $showId],
            'children'
        );

        return $this->tree(
            view('user.profile.fear_meters', compact('profileUser', 'isBlocked', 'fearMeters', 'fearMeterComments', 'pager', 'shortcutRoute')),
            options: ['url' => route('User.Profile.FearMeters', ['show_id' => $showId])]
        );
    }

    public function reviews(string $showId): JsonResponse|Application|Factory|View
    {
        $profileUser = $this->findUser($showId);
        $me = Auth::user();
        $isBlocked = $me && $me->isBlockedBy($profileUser);

        $reviews = UserGameTitleReview::where('user_id', $profileUser->id)
            ->where('is_deleted', false)
            ->where('is_hidden', false)
            ->with('gameTitle')
            ->orderByDesc('updated_at')
            ->paginate(self::PER_PAGE);

        $fearMeters = UserGameTitleFearMeter::where('user_id', $profileUser->id)
            ->whereIn('game_title_id', $reviews->pluck('game_title_id'))
            ->get()
            ->keyBy('game_title_id');

        $pager = new Pager(
            $reviews->currentPage(),
            $reviews->lastPage(),
            'User.Profile.Reviews',
            ['show_id' => $showId],
            'children'
        );

        $shortcutRoute = [
            'profile-node' => [
                'title'    => $profileUser->name . 'さんのプロフィール',
                'url'      => route('User.Profile.Show', ['show_id' => $showId]),
                'children' => [
                    'root-node' => [
                        'title' => 'ルート',
                        'url'   => route('Root'),
                    ],
                ],
            ],
        ];

        return $this->tree(
            view('user.profile.reviews', compact('profileUser', 'isBlocked', 'reviews', 'fearMeters', 'pager', 'shortcutRoute')),
            options: ['url' => route('User.Profile.Reviews', ['show_id' => $showId])]
        );
    }

    public function following(string $showId): JsonResponse|Application|Factory|View
    {
        $profileUser = $this->findUser($showId);
        $me = Auth::user();
        $isBlocked = $me && $me->isBlockedBy($profileUser);

        $followingCount = $profileUser->following()->count();
        $followerCount  = $profileUser->followers()->count();

        $following      = null;
        $myFollowingIds = [];
        $pager          = null;

        if ($me && !$isBlocked) {
            $following = $profileUser->following()->orderByPivot('created_at', 'desc')->paginate(self::PER_PAGE);
            $myFollowingIds = $me->following()->pluck('users.id')->all();
            $pager = new Pager(
                $following->currentPage(),
                $following->lastPage(),
                'User.Profile.Following',
                ['show_id' => $showId],
                'children'
            );
        }

        return $this->tree(
            view('user.profile.following', compact(
                'profileUser', 'me', 'isBlocked', 'following', 'pager',
                'followingCount', 'followerCount', 'myFollowingIds'
            )),
            options: ['url' => route('User.Profile.Following', ['show_id' => $showId])]
        );
    }

    public function followers(string $showId): JsonResponse|Application|Factory|View
    {
        $profileUser = $this->findUser($showId);
        $me = Auth::user();
        $isBlocked = $me && $me->isBlockedBy($profileUser);

        $followingCount = $profileUser->following()->count();
        $followerCount  = $profileUser->followers()->count();

        $followers      = null;
        $myFollowingIds = [];
        $pager          = null;

        if ($me && !$isBlocked) {
            $followers = $profileUser->followers()->orderByPivot('created_at', 'desc')->paginate(self::PER_PAGE);
            $myFollowingIds = $me->following()->pluck('users.id')->all();
            $pager = new Pager(
                $followers->currentPage(),
                $followers->lastPage(),
                'User.Profile.Followers',
                ['show_id' => $showId],
                'children'
            );
        }

        return $this->tree(
            view('user.profile.followers', compact(
                'profileUser', 'me', 'isBlocked', 'followers', 'pager',
                'followingCount', 'followerCount', 'myFollowingIds'
            )),
            options: ['url' => route('User.Profile.Followers', ['show_id' => $showId])]
        );
    }
}

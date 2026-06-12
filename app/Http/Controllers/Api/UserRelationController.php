<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\UserBlock;
use App\Models\UserFollow;
use App\Models\UserMute;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserRelationController
{
    private function findTarget(string $showId): ?User
    {
        return User::where('show_id', $showId)->whereNull('withdrawn_at')->first();
    }

    public function follow(string $showId): JsonResponse
    {
        $me = Auth::user();
        $target = $this->findTarget($showId);

        if (!$target) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }
        if ($me->id === $target->id) {
            return response()->json(['message' => '自分自身をフォローすることはできません。'], 422);
        }
        if ($me->isBlocking($target) || $me->isBlockedBy($target)) {
            return response()->json(['message' => 'フォローできません。'], 422);
        }

        UserFollow::firstOrCreate(['follower_id' => $me->id, 'following_id' => $target->id]);

        return response()->json(['following' => true]);
    }

    public function unfollow(string $showId): JsonResponse
    {
        $me = Auth::user();
        $target = $this->findTarget($showId);

        if (!$target) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }

        UserFollow::where('follower_id', $me->id)->where('following_id', $target->id)->delete();

        return response()->json(['following' => false]);
    }

    public function block(string $showId): JsonResponse
    {
        $me = Auth::user();
        $target = $this->findTarget($showId);

        if (!$target) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }
        if ($me->id === $target->id) {
            return response()->json(['message' => '自分自身をブロックすることはできません。'], 422);
        }

        DB::transaction(function () use ($me, $target) {
            // ブロック時に双方向フォロー関係を削除
            UserFollow::where(function ($q) use ($me, $target) {
                $q->where('follower_id', $me->id)->where('following_id', $target->id);
            })->orWhere(function ($q) use ($me, $target) {
                $q->where('follower_id', $target->id)->where('following_id', $me->id);
            })->delete();

            UserBlock::firstOrCreate(['blocker_id' => $me->id, 'blocked_id' => $target->id]);
        });

        return response()->json(['blocked' => true]);
    }

    public function unblock(string $showId): JsonResponse
    {
        $me = Auth::user();
        $target = $this->findTarget($showId);

        if (!$target) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }

        UserBlock::where('blocker_id', $me->id)->where('blocked_id', $target->id)->delete();

        return response()->json(['blocked' => false]);
    }

    public function mute(string $showId): JsonResponse
    {
        $me = Auth::user();
        $target = $this->findTarget($showId);

        if (!$target) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }
        if ($me->id === $target->id) {
            return response()->json(['message' => '自分自身をミュートすることはできません。'], 422);
        }

        UserMute::firstOrCreate(['muter_id' => $me->id, 'muted_id' => $target->id]);

        return response()->json(['muted' => true]);
    }

    public function unmute(string $showId): JsonResponse
    {
        $me = Auth::user();
        $target = $this->findTarget($showId);

        if (!$target) {
            return response()->json(['message' => 'ユーザーが見つかりません。'], 404);
        }

        UserMute::where('muter_id', $me->id)->where('muted_id', $target->id)->delete();

        return response()->json(['muted' => false]);
    }
}

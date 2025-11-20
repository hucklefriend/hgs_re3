<?php

namespace App\Http\Controllers\Api;

use App\Models\UserFavoriteGameTitle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserFavoriteController
{
    /**
     * お気に入りの登録・解除をトグル
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function toggle(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'game_title_id' => ['required', 'integer', 'exists:game_titles,id'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '無効な入力です。',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();
        $gameTitleId = $validator->validated()['game_title_id'];

        // 既に登録されているか確認
        $exists = UserFavoriteGameTitle::where('user_id', $user->id)
            ->where('game_title_id', $gameTitleId)
            ->exists();

        if ($exists) {
            // 解除
            UserFavoriteGameTitle::where('user_id', $user->id)
                ->where('game_title_id', $gameTitleId)
                ->delete();

            return response()->json([
                'status' => 2,
            ]);
        } else {
            // 登録
            UserFavoriteGameTitle::create([
                'user_id' => $user->id,
                'game_title_id' => $gameTitleId,
            ]);

            return response()->json([
                'status' => 1,
            ]);
        }
    }
}


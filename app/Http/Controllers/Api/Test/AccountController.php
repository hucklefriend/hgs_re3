<?php

namespace App\Http\Controllers\Api\Test;

use App\Models\PasswordReset as PasswordResetModel;
use App\Models\TemporaryRegistration;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends BaseTestController
{
    /**
     * ローカル環境専用：仮登録メールのURL取得API
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getRegistrationUrlForTest(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '無効な入力です。',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = $validator->validated()['email'];

        $temporaryRegistration = TemporaryRegistration::where('email', $email)->first();

        if (!$temporaryRegistration) {
            return response()->json([
                'message' => '登録用URLが見つかりません。',
            ], 404);
        }

        if ($temporaryRegistration->isExpired()) {
            $temporaryRegistration->delete();

            return response()->json([
                'message' => '登録用URLの有効期限が切れています。',
            ], 404);
        }

        return response()->json([
            'email' => $temporaryRegistration->email,
            'registration_url' => route('Account.Register.Complete', ['token' => $temporaryRegistration->token]),
            'expires_at' => $temporaryRegistration->expires_at,
        ]);
    }

    /**
     * ローカル環境専用：パスワードリセットメールのURL取得API
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getPasswordResetUrlForTest(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '無効な入力です。',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = $validator->validated()['email'];

        $passwordReset = PasswordResetModel::where('email', $email)->first();

        if (!$passwordReset) {
            return response()->json([
                'message' => 'パスワードリセット用URLが見つかりません。',
            ], 404);
        }

        if ($passwordReset->isExpired()) {
            $passwordReset->delete();

            return response()->json([
                'message' => 'パスワードリセット用URLの有効期限が切れています。',
            ], 404);
        }

        return response()->json([
            'email' => $passwordReset->email,
            'password_reset_url' => route('Account.PasswordReset.Complete', ['token' => $passwordReset->token]),
            'expires_at' => $passwordReset->expires_at,
        ]);
    }

    /**
     * ローカル環境専用：仮登録の有効期限を1時間以上前に変更するAPI
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function expireRegistrationForTest(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '無効な入力です。',
                'errors' => $validator->errors(),
            ], 422);
        }

        $email = $validator->validated()['email'];

        $temporaryRegistration = TemporaryRegistration::where('email', $email)->first();

        if (!$temporaryRegistration) {
            return response()->json([
                'message' => '登録用URLが見つかりません。',
            ], 404);
        }

        // 有効期限を1時間以上前に変更（2時間前に設定）
        $temporaryRegistration->update([
            'expires_at' => now()->subHours(2),
        ]);

        return response()->json([
            'message' => '有効期限を変更しました。',
            'email' => $temporaryRegistration->email,
            'expires_at' => $temporaryRegistration->expires_at,
        ]);
    }

    /**
     * ローカル環境専用：webmaster@horrorgame.netのパスワードをtesttestにリセットするAPI
     *
     * @return JsonResponse
     */
    public function resetWebmasterPasswordForTest(): JsonResponse
    {
        $email = 'webmaster@horrorgame.net';
        $password = 'testtest';

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'ユーザーが見つかりません。',
            ], 404);
        }

        $user->password = Hash::make($password);
        $user->save();

        return response()->json([
            'message' => 'パスワードをリセットしました。',
            'email' => $email,
        ]);
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AccountController extends Controller
{
    /**
     * ログイン画面表示
     *
     * @return JsonResponse|Application|Factory|View|RedirectResponse
     */
    public function login(): JsonResponse|Application|Factory|View|RedirectResponse
    {
        // 既にログインしている場合はトップページにリダイレクト
        if (Auth::check()) {
            return redirect()->route('Root');
        }

        return $this->tree(view('account.login'));
    }

    /**
     * 認証処理
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function auth(Request $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        $rememberMe = $request->input('remember_me', 0);

        if (Auth::guard('web')->attempt($credentials, $rememberMe == 1)) {
            // 認証に成功したときの処理
            $request->session()->regenerate();
            return redirect()->intended(route('Root'));
        } else {
            // 認証に失敗したときの処理
            return back()->withInput()->withErrors(['login' => 'メールアドレスまたはパスワードが正しくありません。']);
        }
    }

    /**
     * ログアウト処理
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('Root');
    }
}


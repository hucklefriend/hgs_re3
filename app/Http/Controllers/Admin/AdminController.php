<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class AdminController extends AbstractAdminController
{
    /**
     * Adminトップ
     *
     * @return Application|Factory|View
     */
    public function top(): Application|Factory|View
    {
        return view('admin.top');
    }

    /**
     * ログイン
     *
     * @return Application|Factory|View|RedirectResponse
     */
    public function login(): Application|Factory|View|RedirectResponse
    {
        // ローカル環境でのみ、id:1で自動ログインする
        if (App::environment('local')) {
            Auth::loginUsingId(1, true);
            return redirect()->route('Admin');
        }

        return view('admin.login');
    }

    /**
     * 認証
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function auth(Request $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');
        $rememberMe = $request->input('remember_me', 0);

        if (Auth::attempt($credentials, $rememberMe == 1)) {
            // 認証に成功したときの処理
            return redirect()->route('Admin');
        } else {
            // 認証に失敗したときの処理
            return back()->withInput()->withErrors(['login' => '認証に失敗しました。再度やり直してください。']);
        }
    }

    /**
     * ログアウト
     *
     * @return RedirectResponse
     */
    public function logout(): RedirectResponse
    {
        Auth::logout();
        return redirect()->route('Admin.Login');
    }
}

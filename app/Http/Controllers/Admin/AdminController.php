<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

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

        if (Auth::guard('admin')->attempt($credentials, $rememberMe == 1)) {
            // 認証に成功したときの処理
            return redirect()->route('Admin.Dashboard');
        } else {
            // 認証に失敗したときの処理
            return back()->withInput()->withErrors(['login' => '認証に失敗しました。再度やり直してください。']);
        }
    }

    /**
     * ログアウト
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('Admin.Login');
    }
}

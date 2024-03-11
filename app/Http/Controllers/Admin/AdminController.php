<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
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

    public function login()
    {
        // ローカル環境でのみ、id:1で自動ログインする
        if (App::environment('local')) {
            Auth::loginUsingId(1, true);
            return redirect()->route('Admin');
        }

        return view('admin.login');
    }

    public function auth(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, true)) {
            // 認証に成功したときの処理
            return redirect()->route('Admin');
        }
        else {
            // 認証に失敗したときの処理
            return back()->withInput()->withErrors(['email' => 'These credentials do not match our records.']);
        }
    }

    public function logout()
    {
        Auth::logout();;
        return redirect()->route('Admin.Login');
    }
}

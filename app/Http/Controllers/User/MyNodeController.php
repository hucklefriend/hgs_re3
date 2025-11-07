<?php

namespace App\Http\Controllers\User;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class MyNodeController extends Controller
{
    /**
     * マイページトップ表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function top(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        
        return $this->tree(view('user.my_node.top', compact('user')));
    }

    /**
     * 退会画面表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function withdraw(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();

        return $this->tree(view('user.my_node.withdraw', compact('user')));
    }

    /**
     * 退会処理
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function withdrawStore(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->input('password'), $user->password)) {
            return back()->withErrors([
                'password' => 'パスワードが一致しません。',
            ])->withInput();
        }

        $user->withdrawn_at = now();
        $user->save();

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('Account.Login')->with('success', "退会が完了しました。\r\nご利用ありがとうございました。");
    }
}


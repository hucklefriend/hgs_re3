<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Enums\UserRole;
use App\Http\Requests\RegisterRequest;
use App\Mail\EmailVerification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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
            return redirect()->intended(route('User.MyNode.Top'));
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

    /**
     * 新規登録画面表示
     *
     * @return JsonResponse|Application|Factory|View|RedirectResponse
     */
    public function register(): JsonResponse|Application|Factory|View|RedirectResponse
    {
        // 既にログインしている場合はトップページにリダイレクト
        if (Auth::check()) {
            return redirect()->route('Root');
        }

        return $this->tree(view('account.register'));
    }

    /**
     * 新規登録処理
     *
     * @param RegisterRequest $request
     * @return RedirectResponse
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // 既に確認済みのメールアドレスかチェック
        $existingUser = User::where('email', $validated['email'])->first();
        if ($existingUser) {
            if ($existingUser->email_verified_at) {
                // 既に確認済みの場合はエラー
                return back()->withInput()->withErrors(['email' => 'このメールアドレスは既に登録されています。']);
            } else {
                // 未確認のアカウントが存在する場合は、10分経過していない限り再送信しない
                if ($existingUser->email_verification_sent_at && 
                    $existingUser->email_verification_sent_at->copy()->addMinutes(10)->isFuture()) {
                    return back()->withInput()->withErrors(['email' => 'このメールアドレスには既に確認メールを送信しています。メールを確認してください。']);
                }
                // 10分経過している場合は既存のアカウントを削除して続行
                $existingUser->delete();
            }
        }

        // show_idが重複しないように生成
        do {
            $showId = Str::random(8);
        } while (User::where('show_id', $showId)->exists());

        // メール確認用トークンを生成
        $verificationToken = Str::random(64);

        // ユーザー作成
        $user = User::create([
            'show_id' => $showId,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => UserRole::USER->value,
            'hgs12_user' => 0,
            'sign_up_at' => now(),
            'email_verification_token' => $verificationToken,
            'email_verification_sent_at' => now(),
        ]);

        // メール確認URLを生成
        $verificationUrl = route('Account.VerifyEmail', ['token' => $verificationToken]);

        // メール送信
        Mail::to($user->email)->send(new EmailVerification($user, $verificationUrl));

        return redirect()->route('Account.Login')->with('success', 'アカウントが作成されました。メールアドレスの確認メールを送信しました。10分以内にメール内のリンクをクリックして確認してください。');
    }

    /**
     * メールアドレス確認処理
     *
     * @param string $token
     * @return RedirectResponse
     */
    public function verifyEmail(string $token): RedirectResponse
    {
        $user = User::where('email_verification_token', $token)
            ->whereNull('email_verified_at')
            ->first();

        if (!$user) {
            return redirect()->route('Account.Login')->with('error', '無効な確認リンクです。');
        }

        // 10分以内かチェック
        $sentAt = $user->email_verification_sent_at;
        if (!$sentAt || $sentAt->copy()->addMinutes(10)->isPast()) {
            // 10分経過している場合はアカウントを削除
            $user->delete();
            return redirect()->route('Account.Login')->with('error', '確認リンクの有効期限が切れています。再度登録してください。');
        }

        // メールアドレスを確認済みに更新
        $user->update([
            'email_verified_at' => now(),
            'email_verification_token' => null,
            'email_verification_sent_at' => null,
        ]);

        return redirect()->route('Account.Login')->with('success', 'メールアドレスの確認が完了しました。ログインしてください。');
    }
}


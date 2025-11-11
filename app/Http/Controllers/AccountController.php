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
use App\Mail\RegistrationInvitation;
use App\Models\TemporaryRegistration;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ViewErrorBag;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

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

        return $this->tree(view('account.login'), url: route('Account.Login'));
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

        $user = User::where('email', $credentials['email'])->first();
        if ($user && $user->withdrawn_at && Hash::check($credentials['password'], $user->password)) {
            return back()->withInput()->withErrors([
                'login' => 'メールアドレスまたはパスワードが正しくありません。',
            ]);
        }

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
     * 仮登録処理（メールアドレスのみ）
     *
     * @param Request $request
     * @return JsonResponse|Application|Factory|View|RedirectResponse
     */
    public function store(Request $request): JsonResponse|Application|Factory|View|RedirectResponse
    {
        // バリデーションルール
        $rules = [
            'email' => [
                'required',
                'email',
                'max:255',
                // 既に登録済み（sign_up_atがNULLでない）のメールアドレスのみ重複チェック
                Rule::unique('users', 'email')->whereNotNull('sign_up_at'),
            ],
        ];

        // カスタムメッセージ
        $messages = [
            'email.unique' => "このメールアドレスで新規登録はできません。
別のメールアドレスを入力してください。",
        ];

        // バリデーション実行
        $validator = Validator::make($request->all(), $rules, $messages);

        // バリデーションエラーがある場合
        if ($validator->fails()) {
            // エラーメッセージをビューに渡して$this->tree()で返す
            $errors = new ViewErrorBag();
            $errors->put('default', $validator->errors());
            return $this->tree(view('account.register', ['colorState' => 'warning'])->with('errors', $errors));
        }

        $validated = $validator->validated();
        $email = $validated['email'];

        // 既存の仮登録レコードを確認
        $existingRegistration = TemporaryRegistration::where('email', $email)->first();

        if ($existingRegistration) {
            // 有効期限内の場合
            if (!$existingRegistration->isExpired()) {
                // 再送回数が2回未満の場合
                if ($existingRegistration->resend_count < 2) {
                    // トークンを再生成
                    $token = Str::random(64);

                    // 再送回数をインクリメントし、有効期限を1時間後に更新
                    $existingRegistration->update([
                        'token' => $token,
                        'expires_at' => now()->addHour(),
                        'resend_count' => $existingRegistration->resend_count + 1,
                    ]);

                    $this->dispatchRegistrationInvitation($email, $token);

                    return $this->tree(view('account.register-pending'));
                } else {
                    // 再送回数が2回以上の場合、再送不可
                    return back()->withInput()->withErrors([
                        'email' => '再送回数の上限に達しました。有効期限が切れるまでお待ちください。'
                    ]);
                }
            } else {
                // 有効期限切れの場合は削除して新規作成
                $existingRegistration->delete();
            }
        }

        // トークンを生成
        $token = Str::random(64);

        // 仮登録レコードを作成（有効期限は1時間、再送回数は0）
        TemporaryRegistration::create([
            'email' => $email,
            'token' => $token,
            'expires_at' => now()->addHour(),
            'resend_count' => 0,
        ]);

        $this->dispatchRegistrationInvitation($email, $token);

        return $this->tree(view('account.register-pending'));
    }

    /**
     * 登録完了画面表示（トークンから）
     *
     * @param string $token
     * @return JsonResponse|Application|Factory|View|RedirectResponse
     */
    public function showCompleteRegistration(string $token): JsonResponse|Application|Factory|View|RedirectResponse
    {
        // 既にログインしている場合はトップページにリダイレクト
        if (Auth::check()) {
            return redirect()->route('Root');
        }

        $temporaryRegistration = TemporaryRegistration::where('token', $token)->first();

        if (!$temporaryRegistration) {
            return redirect()->route('Account.Register')->with('error', '無効な登録リンクです。');
        }

        if ($temporaryRegistration->isExpired()) {
            $temporaryRegistration->delete();
            return redirect()->route('Account.Register')->with('error', '登録リンクの有効期限が切れています。再度登録してください。');
        }

        return $this->tree(view('account.complete-register', [
            'token' => $token,
            'email' => $temporaryRegistration->email,
        ]));
    }

    /**
     * 登録完了処理
     *
     * @param Request $request
     * @param string $token
     * @return JsonResponse|Application|Factory|View|RedirectResponse
     */
    public function completeRegistration(Request $request, string $token): JsonResponse|Application|Factory|View|RedirectResponse
    {
        $temporaryRegistration = TemporaryRegistration::where('token', $token)->first();

        if (!$temporaryRegistration) {
            return redirect()->route('Account.Register')->with('error', '無効な登録リンクです。');
        }

        if ($temporaryRegistration->isExpired()) {
            $temporaryRegistration->delete();
            return redirect()->route('Account.Register')->with('error', '登録リンクの有効期限が切れています。再度登録してください。');
        }

        // バリデーションルール
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:100'],
        ];

        // バリデーション実行
        $validator = Validator::make($request->all(), $rules);

        // バリデーションエラーがある場合
        if ($validator->fails()) {
            // エラーメッセージをビューに渡して$this->tree()で返す
            $errors = new ViewErrorBag();
            $errors->put('default', $validator->errors());
            return $this->tree(view('account.complete-register', [
                'token' => $token,
                'email' => $temporaryRegistration->email,
            ])->with('errors', $errors));
        }

        $validated = $validator->validated();

        // show_idが重複しないように生成
        do {
            $showId = Str::random(8);
        } while (User::where('show_id', $showId)->exists());

        // ユーザー作成
        $user = User::create([
            'show_id' => $showId,
            'name' => $validated['name'],
            'email' => $temporaryRegistration->email,
            'password' => Hash::make($validated['password']),
            'role' => UserRole::USER->value,
            'hgs12_user' => 0,
            'sign_up_at' => now(),
        ]);

        // 仮登録レコードを削除
        $temporaryRegistration->delete();

        return redirect()->route('Account.Login')->with('success', '登録が完了しました。ログインしてください。');
    }

    /**
     * ローカル環境専用：仮登録メールのURL取得API
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getRegistrationUrlForTest(Request $request): JsonResponse
    {
        if (!app()->environment('local')) {
            abort(404);
        }

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
     * 仮登録メール送信処理を非同期で実行する
     *
     * @param string $email
     * @param string $token
     * @return void
     */
    private function dispatchRegistrationInvitation(string $email, string $token): void
    {
        $registrationUrl = route('Account.Register.Complete', ['token' => $token]);

        Bus::dispatchAfterResponse(function () use ($email, $registrationUrl) {
            try {
                Mail::to($email)->send(new RegistrationInvitation($email, $registrationUrl));
            } catch (\Exception $e) {
                report($e);
            }
        });
    }
}


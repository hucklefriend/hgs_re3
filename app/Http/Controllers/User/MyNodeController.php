<?php

namespace App\Http\Controllers\User;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use App\Mail\EmailChangeVerification;
use App\Models\EmailChangeRequest;
use App\Models\User;

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
        
        return $this->tree(view('user.my_node.top', compact('user')), url: route('User.MyNode.Top'));
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
     * パスワード変更画面表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function password(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();

        return $this->tree(view('user.my_node.password', compact('user')));
    }

    /**
     * メールアドレス変更画面表示
     */
    public function email(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();

        return $this->tree(view('user.my_node.email', [
            'user' => $user,
        ]));
    }

    /**
     * メールアドレス変更処理（確認メール送信）
     */
    public function emailUpdate(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'new_email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ], [
            'new_email.required' => '新しいメールアドレスを入力してください。',
            'new_email.email' => '正しい形式のメールアドレスを入力してください。',
            'new_email.max' => 'メールアドレスは255文字以内で入力してください。',
            'new_email.unique' => 'すでに使用されているメールアドレスです。',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();
        $newEmail = $validated['new_email'];

        if ($newEmail === $user->email) {
            return back()->withErrors([
                'new_email' => '現在登録されているメールアドレスと同じです。',
            ])->withInput();
        }

        EmailChangeRequest::where('user_id', $user->id)->delete();
        EmailChangeRequest::where('new_email', $newEmail)->delete();

        $token = Str::random(64);
        $expiresAt = now()->addMinutes(15);

        EmailChangeRequest::create([
            'user_id' => $user->id,
            'new_email' => $newEmail,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);

        $verificationUrl = route('User.MyNode.Email.Verify', ['token' => $token]);

        $this->dispatchEmailChangeVerification($user, $newEmail, $verificationUrl);

        return redirect()->route('User.MyNode.Top')->with('success', '確認メールを送信しました。メールをご確認ください。');
    }

    /**
     * パスワード変更処理
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function passwordUpdate(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'max:100', 'confirmed'],
        ]);

        $user = Auth::user();

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return back()->withErrors([
                'current_password' => '現在のパスワードが一致しません。',
            ])->withInput();
        }

        if ($request->input('current_password') === $request->input('password')) {
            return back()->withErrors([
                'password' => '現在のパスワードと異なるパスワードを設定してください。',
            ])->withInput($request->except(['password', 'password_confirmation']));
        }

        $user->password = Hash::make($request->input('password'));
        $user->setRememberToken(Str::random(60));
        $user->save();

        $request->session()->regenerateToken();

        return redirect()->route('User.MyNode.Top')->with('success', 'パスワードを変更しました。');
    }

    /**
     * メールアドレス変更確定
     */
    public function emailVerify(Request $request, string $token): RedirectResponse
    {
        $emailChangeRequest = EmailChangeRequest::where('token', $token)->first();

        if (!$emailChangeRequest) {
            return redirect()->route('Account.Login')->with('error', '無効なURLです。');
        }

        if ($emailChangeRequest->isExpired()) {
            $emailChangeRequest->delete();
            return redirect()->route('Account.Login')->with('error', 'メールアドレス変更の有効期限が切れています。');
        }

        /** @var User|null $user */
        $user = $emailChangeRequest->user;

        if (!$user) {
            $emailChangeRequest->delete();
            return redirect()->route('Account.Login')->with('error', '対象のユーザーが見つかりません。');
        }

        $newEmail = $emailChangeRequest->new_email;

        if (User::where('email', $newEmail)->where('id', '!=', $user->id)->exists()) {
            $emailChangeRequest->delete();
            return redirect()->route('Account.Login')->with('error', 'すでに使用されているメールアドレスです。');
        }

        $user->email = $newEmail;
        $user->save();

        $emailChangeRequest->delete();

        Auth::guard('web')->login($user);
        $request->session()->regenerate();
        $request->session()->regenerateToken();

        return redirect()->route('User.MyNode.Top')->with('success', 'メールアドレスを変更しました。');
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

    /**
     * メール変更確認メール送信を非同期で実行
     */
    private function dispatchEmailChangeVerification(User $user, string $newEmail, string $verificationUrl): void
    {
        Bus::dispatchAfterResponse(function () use ($user, $newEmail, $verificationUrl) {
            try {
                Mail::to($newEmail)->send(new EmailChangeVerification($user, $newEmail, $verificationUrl));
            } catch (\Exception $e) {
                report($e);
            }
        });
    }
}


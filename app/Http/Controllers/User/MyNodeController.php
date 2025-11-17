<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\HgnController;
use Carbon\Carbon;
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
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Http\Requests\MyNodeEmailUpdateRequest;
use App\Http\Requests\MyNodePasswordUpdateRequest;
use App\Http\Requests\MyNodeProfileUpdateRequest;
use App\Http\Requests\MyNodeWithdrawStoreRequest;
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
        
        $privacyPolicyRevisionDate = Carbon::parse(HgnController::PRIVACY_POLICY_REVISION_DATE);
        $privacyPolicyVersion = (int)$privacyPolicyRevisionDate->format('Ymd');
        
        $acceptedVersion = $user->privacy_policy_accepted_version ?? 0;
        $needsAcceptance = $acceptedVersion < $privacyPolicyVersion;

        return $this->tree(view('user.my_node.top', compact('user', 'needsAcceptance')), url: route('User.MyNode.Top'));
    }

    /**
     * プロフィール編集画面表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function profile(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $colorState = $this->getColorState();

        return $this->tree(view('user.my_node.profile', compact('user', 'colorState')));
    }

    /**
     * プロフィール更新処理
     *
     * @param MyNodeProfileUpdateRequest $request
     * @return RedirectResponse
     */
    public function profileUpdate(MyNodeProfileUpdateRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validated();

        $user->name = $validated['name'];
        $user->show_id = $validated['show_id'];
        $user->save();

        return redirect()->route('User.MyNode.Top')->with('success', 'プロフィールを更新しました。');
    }

    /**
     * メールアドレス変更画面表示
     * 
     * @return JsonResponse|Application|Factory|View
     */
    public function email(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $colorState = $this->getColorState();

        return $this->tree(view('user.my_node.email', compact('user', 'colorState')));
    }

    /**
     * メールアドレス変更処理（確認メール送信）
     *
     * @param MyNodeEmailUpdateRequest $request
     * @return RedirectResponse
     */
    public function emailUpdate(MyNodeEmailUpdateRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validated();
        $newEmail = $validated['new_email'];

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
     * メールアドレス変更確定
     *
     * @param Request $request
     * @param string $token
     * @return RedirectResponse
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
     * パスワード変更画面表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function password(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $colorState = $this->getColorState();

        return $this->tree(view('user.my_node.password', compact('user', 'colorState')));
    }

    /**
     * パスワード変更処理
     *
     * @param MyNodePasswordUpdateRequest $request
     * @return RedirectResponse
     */
    public function passwordUpdate(MyNodePasswordUpdateRequest $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validated();
        $user->password = Hash::make($validated['password']);
        $user->setRememberToken(Str::random(60));
        $user->save();

        $request->session()->regenerateToken();

        return redirect()->route('User.MyNode.Top')->with('success', 'パスワードを変更しました。');
    }

    /**
     * 退会画面表示
     *
     * @return JsonResponse|Application|Factory|View
     */
    public function withdraw(): JsonResponse|Application|Factory|View
    {
        $user = Auth::user();
        $colorState = $this->getColorState();

        return $this->tree(view('user.my_node.withdraw', compact('user', 'colorState')));
    }

    /**
     * 退会処理
     *
     * @param MyNodeWithdrawStoreRequest $request
     * @return RedirectResponse
     */
    public function withdrawStore(MyNodeWithdrawStoreRequest $request): RedirectResponse
    {
        $user = Auth::user();

        $user->withdrawn_at = now();
        $user->save();

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('Account.Login')->with('success', "退会が完了しました。\r\nご利用ありがとうございました。");
    }

    /**
     * メール変更確認メール送信を非同期で実行
     * 
     * @param User $user
     * @param string $newEmail
     * @param string $verificationUrl
     * @return void
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


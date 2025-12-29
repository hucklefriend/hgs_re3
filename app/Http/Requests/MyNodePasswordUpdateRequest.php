<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class MyNodePasswordUpdateRequest extends BaseWebRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'max:100', 'confirmed'],
        ];
    }

    /**
     * バリデーションメッセージの定義
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'current_password.required' => '現在のパスワードを入力してください。',
            'current_password.string' => '現在のパスワードは文字列で入力してください。',
            'password.required' => '新しいパスワードを入力してください。',
            'password.string' => '新しいパスワードは文字列で入力してください。',
            'password.min' => '新しいパスワードは8文字以上で入力してください。',
            'password.max' => '新しいパスワードは100文字以内で入力してください。',
            'password.confirmed' => 'パスワード（確認）が一致しません。',
        ];
    }

    /**
     * バリデーション後に追加の検証を実行
     *
     * @param Validator $validator
     * @return void
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $user = Auth::user();
            $currentPassword = $this->input('current_password');
            $newPassword = $this->input('password');

            if (!Hash::check($currentPassword, $user->password)) {
                $validator->errors()->add('current_password', '現在のパスワードが一致しません。');
            }

            if ($currentPassword === $newPassword) {
                $validator->errors()->add('password', '現在のパスワードと異なるパスワードを設定してください。');
            }
        });
    }
}


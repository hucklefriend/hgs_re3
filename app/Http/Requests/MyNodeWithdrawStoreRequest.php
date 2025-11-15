<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class MyNodeWithdrawStoreRequest extends BaseWebRequest
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
            'password' => ['required', 'string'],
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
            'password.required' => 'パスワードを入力してください。',
            'password.string' => 'パスワードは文字列で入力してください。',
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
            $password = $this->input('password');

            if (!Hash::check($password, $user->password)) {
                $validator->errors()->add('password', 'パスワードが一致しません。');
            }
        });
    }
}


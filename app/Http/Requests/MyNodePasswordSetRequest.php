<?php

namespace App\Http\Requests;

class MyNodePasswordSetRequest extends BaseWebRequest
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
            'password.required' => 'パスワードを入力してください。',
            'password.string' => 'パスワードは文字列で入力してください。',
            'password.min' => 'パスワードは8文字以上で入力してください。',
            'password.max' => 'パスワードは100文字以内で入力してください。',
            'password.confirmed' => 'パスワード（確認）が一致しません。',
        ];
    }
}

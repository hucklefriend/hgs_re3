<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;

class CompleteRegisterRequest extends BaseWebRequest
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
            'name' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'max:100', 'regex:/^[a-zA-Z0-9!-~]+$/'],
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
            'name.required' => '名前は必須です。',
            'name.string' => '名前は文字列で入力してください。',
            'name.max' => '名前は255文字以内で入力してください。',
            'password.required' => 'パスワードは必須です。',
            'password.string' => 'パスワードは文字列で入力してください。',
            'password.min' => 'パスワードは8文字以上で入力してください。',
            'password.max' => 'パスワードは100文字以内で入力してください。',
            'password.regex' => 'パスワードは半角英数字と記号のみ使用できます。',
        ];
    }
}

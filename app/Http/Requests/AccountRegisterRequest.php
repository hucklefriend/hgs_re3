<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class AccountRegisterRequest extends BaseWebRequest
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
     * @return array
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'max:255',
                // 既に登録済み（sign_up_atがNULLでない）のメールアドレスのみ重複チェック
                Rule::unique('users', 'email')->whereNotNull('sign_up_at'),
            ],
            'name' => ['nullable', 'max:0'],
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
            'email.unique' => "このメールアドレスで新規登録はできません。\n別のメールアドレスを入力してください。",
            'name.max' => '不正な入力が検出されました。再度お試しください。',
        ];
    }

}


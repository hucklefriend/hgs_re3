<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class MyNodeEmailUpdateRequest extends BaseWebRequest
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
        $user = $this->user();

        return [
            'new_email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
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
            'new_email.required' => '新しいメールアドレスを入力してください。',
            'new_email.email' => '正しい形式のメールアドレスを入力してください。',
            'new_email.max' => 'メールアドレスは255文字以内で入力してください。',
            'new_email.unique' => 'すでに使用されているメールアドレスです。',
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
            $newEmail = $this->input('new_email');

            if ($newEmail === $user->email) {
                $validator->errors()->add('new_email', '現在登録されているメールアドレスと同じです。');
            }
        });
    }
}


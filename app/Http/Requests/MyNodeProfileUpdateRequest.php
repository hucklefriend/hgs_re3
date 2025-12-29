<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class MyNodeProfileUpdateRequest extends BaseWebRequest
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
            'name' => ['required', 'string', 'max:255'],
            'show_id' => [
                'required',
                'string',
                'min:1',
                'max:30',
                'regex:/^[A-Za-z0-9_-]+$/',
                Rule::unique('users', 'show_id')->ignore($user->id),
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
            'name.required' => '表示名を入力してください。',
            'name.string' => '表示名は文字列で入力してください。',
            'name.max' => '表示名は255文字以内で入力してください。',
            'show_id.required' => 'ユーザーIDを入力してください。',
            'show_id.string' => 'ユーザーIDは文字列で入力してください。',
            'show_id.min' => 'ユーザーIDは1文字以上で入力してください。',
            'show_id.max' => 'ユーザーIDは30文字以内で入力してください。',
            'show_id.regex' => 'ユーザーIDに使用できるのは英数字・ハイフン・アンダースコアのみです。',
            'show_id.unique' => 'このユーザーIDは既に使用されています。',
        ];
    }
}


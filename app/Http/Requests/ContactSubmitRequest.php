<?php

namespace App\Http\Requests;

use App\Enums\ContactCategory;
use Illuminate\Validation\Rules\Enum;

class ContactSubmitRequest extends BaseWebRequest
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
            'name' => 'nullable|string|max:255',
            'category' => ['nullable', new Enum(ContactCategory::class)],
            'message' => 'required|string|max:10000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.max' => 'お名前は255文字以内で入力してください。',
            'category.enum' => 'カテゴリーが不正です。',
            'message.required' => '問い合わせ内容は必須です。',
            'message.max' => '問い合わせ内容は10000文字以内で入力してください。',
        ];
    }
}


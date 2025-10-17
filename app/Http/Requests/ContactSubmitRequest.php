<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactSubmitRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'subject' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
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
            'name.required' => 'お名前は必須です。',
            'name.max' => 'お名前は255文字以内で入力してください。',
            'subject.max' => '件名は255文字以内で入力してください。',
            'category.max' => 'カテゴリーは255文字以内で入力してください。',
            'message.required' => 'お問い合わせ内容は必須です。',
            'message.max' => 'お問い合わせ内容は10000文字以内で入力してください。',
        ];
    }
}


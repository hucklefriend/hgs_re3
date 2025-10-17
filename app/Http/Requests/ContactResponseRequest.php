<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactResponseRequest extends FormRequest
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
            'responder_name' => 'required|string|max:255',
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
            'responder_name.required' => 'お名前は必須です。',
            'responder_name.max' => 'お名前は255文字以内で入力してください。',
            'message.required' => '返信内容は必須です。',
            'message.max' => '返信内容は10000文字以内で入力してください。',
        ];
    }
}

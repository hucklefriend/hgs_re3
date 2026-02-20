<?php

namespace App\Http\Requests\Admin\Manage;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class InformationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        $rules = [
            'head'        => 'required',
            'header_text' => 'nullable',
            'priority'    => 'required|integer',
            'open_at'     => 'required|date_format:Y-m-d\TH:i',
            'no_end'      => 'nullable',
            'close_at'    => 'required_without:no_end|nullable|date_format:Y-m-d\TH:i',
        ];

        for ($i = 1; $i <= 10; $i++) {
            $rules['sub_title_' . $i] = 'nullable|string|max:255';
            $rules['sub_text_' . $i]  = 'nullable|string';
        }

        return $rules;
    }
}

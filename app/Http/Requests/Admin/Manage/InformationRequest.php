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
        return [
            'head'     => 'required',
            'body'     => 'required',
            'priority' => 'required|integer',
            'open_at'  => 'required|date_format:Y-m-d\TH:i',
            'close_at' => 'required|date_format:Y-m-d\TH:i',
        ];
    }
}

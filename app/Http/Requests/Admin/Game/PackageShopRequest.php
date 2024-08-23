<?php

namespace App\Http\Requests\Admin\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class PackageShopRequest extends FormRequest
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
            'shop_id'     => ['required', new Enum(\App\Enums\Shop::class)],
            'url'         => 'required',
            'img_tag'     => 'nullable',
            'param1'      => 'nullable',
            'param2'      => 'nullable',
            'param3'      => 'nullable',
            'use_img_tag' => 'nullable',
        ];
    }
}

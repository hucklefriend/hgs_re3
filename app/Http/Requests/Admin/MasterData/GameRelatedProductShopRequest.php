<?php

namespace App\Http\Requests\Admin\MasterData;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GameRelatedProductShopRequest extends FormRequest
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
            'shop_id'    => ['required', new Enum(\App\Enums\Game\Shop::class)],
            'url'        => 'required',
            'param1'     => 'nullable',
            'param2'     => 'nullable',
            'param3'     => 'nullable',
        ];
    }
}

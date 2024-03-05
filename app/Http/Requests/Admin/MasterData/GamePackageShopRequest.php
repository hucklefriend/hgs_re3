<?php

namespace App\Http\Requests\Admin\MasterData;

use Hgs3\Enums\Game\Shop;
use Hgs3\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GamePackageShopRequest extends FormRequest
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
            'package_id'       => 'required,exists:game_packages,id',
            'shop_id'          => ['required', new Enum(Shop::class)],
            'shop_url'         => 'required',
            'small_image_url'  => 'nullable',
            'medium_image_url' => 'nullable',
            'large_image_url'  => 'nullable',
            'release_int'      => 'required|numeric|integer|min:0|max:99999999',
            'rated_r'          => ['required', new Enum(RatedR::class)],
            'param1'           => 'nullable',
            'param2'           => 'nullable',
            'param3'           => 'nullable',
            'param4'           => 'nullable',
            'param5'           => 'nullable',
            'param6'           => 'nullable',
            'param7'           => 'nullable',
            'param8'           => 'nullable',
            'param9'           => 'nullable',
            'param10'          => 'nullable',
        ];
    }
}

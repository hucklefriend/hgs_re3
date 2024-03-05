<?php

namespace App\Http\Requests\Admin\MasterData;


use Hgs3\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GameSoftRequest extends FormRequest
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
            'name'                      => 'required|max:200',
            'phonetic'                  => 'required|max:200|regex:/^[あ-ん][ぁ-んー0-9]*/',
            'phonetic2'                 => 'required|max:250|regex:/^[あ-ん][ぁ-んー0-9]*/',
            'genre'                     => 'nullable|max:150',
            'series_id'                 => 'nullable|exists:game_series,id',
            'order_in_series'           => 'nullable|numeric|integer|min:0|max:99999999',
            'franchise_id'              => 'required|exists:game_franchises,id',
            'original_package_id'       => 'nullable|exists:game_packages,id',
            'introduction'              => 'nullable|max:1000',
            'introduction_from'         => 'required_with:introduction|max:1000',
            'introduction_from_rated_r' => [new Enum(RatedR::class)],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\MasterData;


use Hgs3\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GamePackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name'         => 'required|max:200',
            'acronym'      => 'required|max:30',
            'platform_id'  => 'nullable|exists:game_platforms,id',
            'maker_id'     => 'required|exists:game_makers,id',
            'release_at'   => 'required|max:100',
            'release_int'  => 'required|numeric|integer|min:0|max:99999999',
            'rated_r'      => ['required', new Enum(RatedR::class)],
        ];
    }
}

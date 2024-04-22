<?php

namespace App\Http\Requests\Admin\MasterData;


use App\Enums\RatedR;
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
            'name'              => 'required|max:200',
            'acronym'           => 'required|max:30',
            'node_title'        => 'required|max:200',
            'game_platform_id'  => 'required_without:game_platform_ids|exists:game_platforms,id',
            'game_platform_ids' => 'required_without:game_platform_id|array|exists:game_platforms,id',
            'game_maker_id'     => 'nullable|exists:game_makers,id',
            'release_at'        => 'required|max:100',
            'release_int'       => 'required|numeric|integer|min:0|max:99999999',
            'rated_r'           => ['required', new Enum(RatedR::class)],
        ];
    }
}

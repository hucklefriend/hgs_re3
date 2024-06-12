<?php

namespace App\Http\Requests\Admin\MasterData;


use App\Enums\Rating;
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
            'node_name'         => 'required|max:200',
            'game_platform_id'  => 'required_without:game_platform_ids|exists:game_platforms,id',
            'game_platform_ids' => 'required_without:game_platform_id|array|exists:game_platforms,id',
            'game_maker_id'     => 'nullable|exists:game_makers,id',
            'release_at'        => 'required|max:100',
            'img_s_url'         => 'nullable|max:250',
            'img_m_url'         => 'nullable|max:250',
            'rating'            => ['required', new Enum(Rating::class)],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\Game;


use App\Enums\MediaMixType;
use App\Enums\Rating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class MediaMixRequest extends FormRequest
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
     * @return void
     */
    protected function prepareForValidation(): void
    {
        if ($this->description === null) {
            $this->merge(['description' => '']);
        }
        if ($this->use_ogp_description === null) {
            $this->merge(['use_ogp_description' => 0]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'type'                    => ['required', new Enum(MediaMixType::class)],
            'name'                    => 'required|max:200',
            'key'                     => 'required|max:50',
            'node_name'               => 'required|max:200',
            'game_franchise_id'       => 'nullable|exists:game_franchises,id',
            'game_media_mix_group_id' => 'nullable|exists:game_media_mix_groups,id',
            'rating'                  => ['required', new Enum(Rating::class)],
            'sort_order'              => 'required|numeric',
            'description'             => 'nullable',
            'description_source'      => 'nullable',
            'use_ogp_description'     => 'required|boolean',
        ];
    }
}

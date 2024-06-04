<?php

namespace App\Http\Requests\Admin\MasterData;


use App\Enums\MediaMixType;
use App\Enums\Rating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GameMediaMixRequest extends FormRequest
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
            'type'                => ['required', new Enum(MediaMixType::class)],
            'name'                => 'required|max:200',
            'key'                 => 'required|max:50',
            'node_name'           => 'required|max:200',
            'h1_node_name'        => 'required|max:200',
            'game_franchise_id'   => 'nullable|exists:game_franchises,id',
            'rating'              => ['required', new Enum(Rating::class)],
            'group_no'            => 'required|numeric',
            'sort_order'          => 'required|numeric',
            'explain'             => 'nullable',
            'explain_source_name' => 'nullable|max:100',
            'explain_source_url'  => 'nullable|max:100',
        ];
    }
}

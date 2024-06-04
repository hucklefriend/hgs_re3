<?php

namespace App\Http\Requests\Admin\MasterData;


use App\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GameTitleMultiUpdateRequest extends FormRequest
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
            'node_name'      => 'array',
            'node_name.*'    => 'string|max:200',
            'h1_node_name'   => 'array',
            'h1_node_name.*' => 'string|max:200',
            'key'            => 'array',
            'key.*'          => 'string|max:50',
        ];
    }
}

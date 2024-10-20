<?php

namespace App\Http\Requests\Admin\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class TitleMultiPackageGroupUpdateRequest extends FormRequest
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
            'id'           => 'array',
            'id.*'         => 'integer|exists:game_package_groups,id',
            'name'         => 'array',
            'name.*'       => 'string|max:200',
            'node_name'    => 'array',
            'node_name.*'  => 'string|max:200',
            'sort_order'   => 'array',
            'sort_order.*' => 'nullable|int',
        ];
    }
}

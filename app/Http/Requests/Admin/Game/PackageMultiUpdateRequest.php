<?php

namespace App\Http\Requests\Admin\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class PackageMultiUpdateRequest extends FormRequest
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
     * node_name.*がnullだった場合、空文字列でマージ
     *
     * @return void
     */
    public function prepareForValidation(): void
    {
        if ($this->node_name === null) {
            $this->merge(['node_name' => []]);
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
            'id'           => 'array',
            'id.*'         => 'integer|exists:game_packages,id',
            'name'         => 'array',
            'name.*'       => 'string|max:200',
            'node_name'    => 'array',
            'node_name.*'  => 'nullable|string|max:200',
            'release_at'   => 'array',
            'release_at.*' => 'string|max:200',
            'sort_order'   => 'array',
            'sort_order.*' => 'integer',
        ];
    }
}

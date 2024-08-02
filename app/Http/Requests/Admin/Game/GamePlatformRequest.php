<?php

namespace App\Http\Requests\Admin\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GamePlatformRequest extends FormRequest
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
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name'               => 'required|max:200',
            'key'                => 'required|max:50',
            'acronym'            => 'required|max:30',
            'node_name'          => 'required|max:200',
            'h1_node_name'       => 'required|max:200',
            'sort_order'         => 'required|integer|min:0|max:99999999',
            'game_maker_id'      => 'nullable|exists:game_makers,id',
            'description'        => '',
            'description_source' => 'nullable',
        ];
    }
}

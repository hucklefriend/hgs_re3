<?php

namespace App\Http\Requests\Admin\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class MakerRequest extends FormRequest
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
        if ($this->synonymsStr === null) {
            $this->merge(['synonymsStr' => '']);
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
            'name'                  => 'required|max:100',
            'key'                   => 'required|max:50',
            'node_name'             => 'required|max:200',
            'type'                  => 'required|integer',
            'related_game_maker_id' => 'nullable|exists:game_makers,id',
            'synonymsStr'           => '',
            'description'           => 'nullable',
            'description_source'    => 'nullable',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\MasterData;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GameMakerRequest extends FormRequest
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
            'acronym'               => 'required|max:100',
            'phonetic'              => 'required|max:100|regex:/^[あ-ん][ぁ-んー0-9]*/u',
            'node_name'             => 'required|max:200',
            'h1_node_name'          => 'required|max:200',
            'related_game_maker_id' => 'nullable|exists:game_makers,id',
            'synonymsStr'           => '',
            'description'           => 'nullable',
            'description_source'    => 'nullable',
        ];
    }
}

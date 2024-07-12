<?php

namespace App\Http\Requests\Admin\MasterData;

use Illuminate\Foundation\Http\FormRequest;

class GameTitleRequest extends FormRequest
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
     * @return void
     */
    protected function prepareForValidation(): void
    {
        if ($this->description === null) {
            $this->merge([
                'description' => '',
            ]);
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
            'name'                => 'required|max:200',
            'key'                 => 'required|max:50',
            'phonetic'            => 'required|max:200|regex:/^[あ-ん][ぁ-んー0-9]*/',
            'node_name'           => 'required|max:200',
            'h1_node_name'        => 'required|max:200',
            'genre'               => 'nullable|max:150',
            'original_package_id' => 'nullable|exists:game_packages,id',
            'description'         => '',
            'description_source'  => 'nullable',
            'first_release_int'   => 'required|numeric|max:99999999',
        ];
    }
}

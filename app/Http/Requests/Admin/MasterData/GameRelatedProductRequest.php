<?php

namespace App\Http\Requests\Admin\MasterData;


use App\Enums\Rating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GameRelatedProductRequest extends FormRequest
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
            'name'               => 'required|max:200',
            'node_name'          => 'required|max:200',
            'img_s_url'          => 'nullable|max:250',
            'img_m_url'          => 'nullable|max:250',
            'rating'             => ['required', new Enum(Rating::class)],
            'description'        => '',
            'description_source' => 'nullable',
        ];
    }
}

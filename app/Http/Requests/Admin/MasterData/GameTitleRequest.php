<?php

namespace App\Http\Requests\Admin\MasterData;


use App\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

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

    protected function prepareForValidation(): void
    {
        if ($this->introduction === null) {
            $this->merge([
                'introduction' => '',
            ]);
        }
        if ($this->introduction_from === null) {
            $this->merge([
                'introduction_from' => '',
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
            'name'                      => 'required|max:200',
            'phonetic'                  => 'required|max:200|regex:/^[あ-ん][ぁ-んー0-9]*/',
            'genre'                     => 'nullable|max:150',
            'original_package_id'       => 'nullable|exists:game_packages,id',
            'introduction'              => 'nullable|max:1000',
            'introduction_from'         => 'required_with:introduction|max:1000',
            'introduction_from_rated_r' => [new Enum(RatedR::class)],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\MasterData;

use Illuminate\Foundation\Http\FormRequest;

class GamePackageShopMultiUpdateRequest extends FormRequest
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
        $texts = $this->input('url', []);
        $preparedTexts = array_map(function ($text) {
            return $text === null ? '' : $text;
        }, $texts);

        $this->merge([
            'url' => $preparedTexts
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'url'      => 'array',
            'url.*'    => 'string',
            'param1'   => 'array',
            'param1.*' => 'nullable|string|max:200',
        ];
    }
}

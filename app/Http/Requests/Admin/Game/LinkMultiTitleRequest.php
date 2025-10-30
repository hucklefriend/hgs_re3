<?php

namespace App\Http\Requests\Admin\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class LinkMultiTitleRequest extends FormRequest
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
        if ($this->game_title_ids === null) {
            $this->merge(['game_title_ids' => []]);
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
            'game_title_ids' => 'nullable|array|exists:game_titles,id',
        ];
    }
}

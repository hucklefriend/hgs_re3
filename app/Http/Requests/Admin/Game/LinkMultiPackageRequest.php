<?php

namespace App\Http\Requests\Admin\Game;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class LinkMultiPackageRequest extends FormRequest
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
        if ($this->game_package_ids === null) {
            $this->merge(['game_package_ids' => []]);
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
            'game_package_ids' => 'nullable|array|exists:game_packages,id',
        ];
    }
}

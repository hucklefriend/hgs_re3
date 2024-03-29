<?php

namespace App\Http\Requests\Admin\MasterData;


use Hgs3\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;

class GamePackageSoftRelationRequest extends FormRequest
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
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'soft_id' => 'nullable|array|exists:game_softs,id',
        ];
    }
}

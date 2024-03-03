<?php
/**
 * ゲームパッケージとソフトの紐づけリクエスト
 */

namespace Hgs3\Http\Requests\Master;

use Hgs3\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

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

<?php
/**
 * ゲームぷらっふぉとーむリクエスト
 */

namespace Hgs3\Http\Requests\Master;

use App\Enums\RatedR;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GamePlatformRequest extends FormRequest
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
            'name'          => 'required|max:200',
            'acronym'       => 'required|max:30',
            'sort_order'    => 'required|integer|min:0|max:99999999',
            'game_maker_id' => 'nullable|exists:game_makers,id',
            'url'           => 'nullable|max:300',
            'rated_r'       => ['required', new Enum(RatedR::class)],
        ];
    }
}

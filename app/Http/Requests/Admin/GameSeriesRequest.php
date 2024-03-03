<?php
/**
 * ゲームシリーズリクエスト
 */

namespace Hgs3\Http\Requests\Master;

use Illuminate\Foundation\Http\FormRequest;

class GameSeriesRequest extends FormRequest
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
            'name'         => 'required|max:200',
            'phonetic'     => 'required|max:200|regex:/^[あ-ん][ぁ-んー0-9]*/u',
            'franchise_id' => 'required|exists:game_franchises,id'
        ];
    }
}

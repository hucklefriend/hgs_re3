<?php
/**
 * ゲームメーカーリクエスト
 */

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class GameMakerRequest extends FormRequest
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
            'name'        => 'required|max:100',
            'acronym'     => 'required|max:100',
            'phonetic'    => 'required|max:100|regex:/^[あ-ん][ぁ-んー0-9]*/u',
            'synonymsStr' => '',
        ];
    }
}

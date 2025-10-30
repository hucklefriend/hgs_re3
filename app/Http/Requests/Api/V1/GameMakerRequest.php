<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @method bool isMethod(string $method)
 * @method mixed route(string $key = null, mixed $default = null)
 */
class GameMakerRequest extends FormRequest
{
    /**
     * リクエストの認可を判定
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     *
     * @return array
     */
    public function rules(): array
    {
        $rules = [
            'key' => 'required|unique:game_makers,key|max:50',
            'name' => 'required|max:200',
            'node_name' => 'required|max:200',
            'type' => 'required|integer',
            'description' => 'nullable|string',
            'description_source' => 'nullable|string',
            'related_game_maker_id' => 'nullable|integer'
        ];

        // updateの場合は、自身のkeyをuniqueチェックから除外
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['key'] = 'sometimes|unique:game_makers,key,' . $this->route('game_maker') . '|max:50';
            $rules['name'] = 'sometimes|max:200';
            $rules['node_name'] = 'sometimes|max:200';
            $rules['type'] = 'sometimes|integer';
        }

        return $rules;
    }
} 
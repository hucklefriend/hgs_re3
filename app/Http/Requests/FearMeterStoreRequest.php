<?php

namespace App\Http\Requests;

use App\Enums\FearMeter;
use Illuminate\Validation\Rule;

class FearMeterStoreRequest extends BaseWebRequest
{
    /**
     * ユーザーがこのリクエストの権限を持っているか
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
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title_key' => [
                'required',
                'string',
                'exists:game_titles,key',
            ],
            'fear_meter' => [
                'required',
                'integer',
                Rule::enum(FearMeter::class),
            ],
        ];
    }

    /**
     * バリデーション属性名
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title_key' => 'タイトル',
            'fear_meter' => '怖さメーター',
        ];
    }
}

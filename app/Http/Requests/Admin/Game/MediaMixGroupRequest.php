<?php

namespace App\Http\Requests\Admin\Game;


use App\Enums\Rating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class MediaMixGroupRequest extends FormRequest
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
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'game_franchise_id' => 'required|exists:game_franchises,id',
            'name'              => 'required|max:200',
            'node_name'         => 'required|max:200',
            'description'       => 'nullable',
        ];
    }
}

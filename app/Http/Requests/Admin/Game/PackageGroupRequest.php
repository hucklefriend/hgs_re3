<?php

namespace App\Http\Requests\Admin\Game;


use App\Enums\Rating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class PackageGroupRequest extends FormRequest
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
            'name'       => 'required|max:200',
            'node_name'  => 'required|max:200',
            'sort_order' => 'required|integer',
            'linked'     => 'nullable',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\MasterData;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class GameFranchiseRequest extends FormRequest
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
            'name'               => 'required|max:200',
            'key'                => 'required|max:50',
            'phonetic'           => 'required|max:200|regex:/^[あ-ん][ぁ-んー0-9]*/u',
            'node_name'          => 'required|max:200',
            'h1_node_name'       => 'required|max:200',
            'description'        => 'nullable',
            'description_source' => 'nullable',
        ];
    }
}

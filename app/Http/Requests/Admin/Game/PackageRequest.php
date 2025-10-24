<?php

namespace App\Http\Requests\Admin\Game;


use App\Enums\ProductDefaultImage;
use App\Enums\Rating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;

class PackageRequest extends FormRequest
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
     * @return void
     */
    protected function prepareForValidation(): void
    {
        if ($this->node_name === null) {
            $this->merge(['node_name' => '']);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name'              => 'required|max:200',
            'acronym'           => 'nullable|max:30',
            'node_name'         => 'nullable|max:200',
            'game_platform_id'  => 'required_without:game_platform_ids|exists:game_platforms,id',
            'game_platform_ids' => 'required_without:game_platform_id|array|exists:game_platforms,id',
            'game_maker_ids'    => 'nullable|array|exists:game_makers,id',
            'release_at'        => 'required|max:100',
            'sort_order'        => 'required|integer',
            'default_img_type'  => ['required', new Enum(ProductDefaultImage::class)],
            'rating'            => ['required', new Enum(Rating::class)],
        ];
    }
}

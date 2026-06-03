<?php

namespace App\Http\Requests;

class TimelineSettingsUpdateRequest extends BaseWebRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'show_horror_keyword_rss'     => ['nullable', 'boolean'],
            'show_favorite_franchise_rss' => ['nullable', 'boolean'],
            'show_followed_user_activity' => ['nullable', 'boolean'],
            'publish_activity_to_root'    => ['nullable', 'boolean'],
        ];
    }
}

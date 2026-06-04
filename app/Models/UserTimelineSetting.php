<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTimelineSetting extends Model
{
    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'show_horror_keyword_rss',
        'show_favorite_franchise_rss',
        'show_followed_user_activity',
        'publish_activity_to_root',
    ];

    protected $casts = [
        'show_horror_keyword_rss'     => 'boolean',
        'show_favorite_franchise_rss' => 'boolean',
        'show_followed_user_activity' => 'boolean',
        'publish_activity_to_root'    => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ユーザーの設定を取得する。レコードがない場合はデフォルト値で返す。
     */
    public static function forUser(int $userId): self
    {
        return self::firstOrNew(
            ['user_id' => $userId],
            [
                'show_horror_keyword_rss'     => true,
                'show_favorite_franchise_rss' => true,
                'show_followed_user_activity' => true,
                'publish_activity_to_root'    => true,
            ],
        );
    }
}

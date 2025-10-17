<?php

namespace App\Models;

use App\Enums\ContactStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $hidden = ['updated_at', 'deleted_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'status' => 0,
    ];

    /**
     * キャスト設定
     *
     * @return array
     */
    protected function casts(): array
    {
        return [
            'status' => ContactStatus::class,
        ];
    }

    /**
     * レスポンスとのリレーション
     *
     * @return HasMany
     */
    public function responses(): HasMany
    {
        return $this->hasMany(ContactResponse::class);
    }

    /**
     * Get masked message for public users
     * Replace content between slash-asterisk and asterisk-slash with black squares
     *
     * @return string
     */
    public function getMaskedMessageAttribute(): string
    {
        return preg_replace_callback('/\/\*(.*?)\*\//s', function ($matches) {
            $length = mb_strlen($matches[1]);
            return str_repeat('■', $length);
        }, $this->message);
    }

    /**
     * Get masked subject for public users
     *
     * @return string|null
     */
    public function getMaskedSubjectAttribute(): ?string
    {
        if (!$this->subject) {
            return null;
        }
        return preg_replace_callback('/\/\*(.*?)\*\//s', function ($matches) {
            $length = mb_strlen($matches[1]);
            return str_repeat('■', $length);
        }, $this->subject);
    }
}


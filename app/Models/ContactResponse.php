<?php

namespace App\Models;

use App\Enums\ContactResponderType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactResponse extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $hidden = ['updated_at', 'deleted_at'];

    /**
     * キャスト設定
     *
     * @return array
     */
    protected function casts(): array
    {
        return [
            'responder_type' => ContactResponderType::class,
        ];
    }

    /**
     * 問い合わせとのリレーション
     *
     * @return BelongsTo
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /**
     * 返信した管理者とのリレーション
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
}


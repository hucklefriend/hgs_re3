<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'show_id',
        'name',
        'email',
        'password',
        'role',
        'hgs12_user',
        'sign_up_at',
        'email_verification_token',
        'email_verification_sent_at',
        'withdrawn_at',
        'privacy_policy_accepted_version',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sign_up_at' => 'datetime',
            'email_verification_sent_at' => 'datetime',
            'withdrawn_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * お気に入りゲームタイトルを取得
     *
     * @return BelongsToMany
     */
    public function favoriteGameTitles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class, UserFavoriteGameTitle::class, 'user_id', 'game_title_id');
    }

    /**
     * 怖さメーター評価を取得
     *
     * @return HasMany
     */
    public function fearMeters(): HasMany
    {
        return $this->hasMany(UserGameTitleFearMeter::class, 'user_id');
    }
}

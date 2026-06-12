<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

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
        'two_factor_method',
        'two_factor_secret',
        'role',
        'hgs12_user',
        'sign_up_at',
        'email_verification_token',
        'email_verification_sent_at',
        'withdrawn_at',
        'privacy_policy_accepted_version',
        'avatar_filename',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
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
            'role' => UserRole::class,
            'two_factor_secret' => 'encrypted',
        ];
    }

    /**
     * お気に入りゲームタイトルを取得
     */
    public function favoriteGameTitles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class, UserFavoriteGameTitle::class, 'user_id', 'game_title_id');
    }

    /**
     * 怖さメーター評価を取得
     */
    public function fearMeters(): HasMany
    {
        return $this->hasMany(UserGameTitleFearMeter::class, 'user_id');
    }

    /**
     * 怖さメーター入力制限
     */
    public function fearMeterRestrictions(): HasMany
    {
        return $this->hasMany(UserFearMeterRestriction::class, 'user_id');
    }

    /**
     * ソーシャルアカウント連携を取得
     */
    public function socialAccounts(): HasMany
    {
        return $this->hasMany(SocialAccount::class);
    }

    /**
     * OAuthのみで登録し、まだパスワードを設定していないか
     */
    public function needsPasswordSet(): bool
    {
        return $this->password === null && $this->socialAccounts()->exists();
    }

    /**
     * メール2段階認証が有効か
     */
    public function hasTwoFactorEmail(): bool
    {
        return $this->two_factor_method === 'email';
    }

    /**
     * TOTP（Authenticator）2段階認証が有効か
     */
    public function hasTwoFactorTotp(): bool
    {
        return $this->two_factor_method === 'totp';
    }

    /**
     * 2段階認証が有効か（将来の認証方式追加に備えたラッパー）
     */
    public function hasTwoFactor(): bool
    {
        return $this->two_factor_method !== null;
    }

    /**
     * タイムライン設定
     */
    public function timelineSetting(): HasOne
    {
        return $this->hasOne(UserTimelineSetting::class);
    }

    /**
     * フォローしているユーザー一覧
     */
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_follows', 'follower_id', 'following_id')
            ->withPivot('created_at');
    }

    /**
     * フォロワー一覧
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_follows', 'following_id', 'follower_id')
            ->withPivot('created_at');
    }

    /**
     * ブロックしているユーザー一覧
     */
    public function blocking(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_blocks', 'blocker_id', 'blocked_id')
            ->withPivot('created_at');
    }

    /**
     * 自分をブロックしているユーザー一覧
     */
    public function blockedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_blocks', 'blocked_id', 'blocker_id')
            ->withPivot('created_at');
    }

    /**
     * ミュートしているユーザー一覧
     */
    public function muting(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_mutes', 'muter_id', 'muted_id')
            ->withPivot('created_at');
    }

    /**
     * 自分をミュートしているユーザー一覧
     */
    public function mutedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_mutes', 'muted_id', 'muter_id')
            ->withPivot('created_at');
    }

    /**
     * 指定ユーザーをフォローしているか
     */
    public function isFollowing(User $user): bool
    {
        return UserFollow::where('follower_id', $this->id)
            ->where('following_id', $user->id)
            ->exists();
    }

    /**
     * 指定ユーザーにフォローされているか
     */
    public function isFollowedBy(User $user): bool
    {
        return UserFollow::where('follower_id', $user->id)
            ->where('following_id', $this->id)
            ->exists();
    }

    /**
     * 指定ユーザーをブロックしているか
     */
    public function isBlocking(User $user): bool
    {
        return UserBlock::where('blocker_id', $this->id)
            ->where('blocked_id', $user->id)
            ->exists();
    }

    /**
     * 指定ユーザーにブロックされているか
     */
    public function isBlockedBy(User $user): bool
    {
        return UserBlock::where('blocker_id', $user->id)
            ->where('blocked_id', $this->id)
            ->exists();
    }

    /**
     * 指定ユーザーをミュートしているか
     */
    public function isMuting(User $user): bool
    {
        return UserMute::where('muter_id', $this->id)
            ->where('muted_id', $user->id)
            ->exists();
    }

    /**
     * アバター URL を返す。未設定の場合は黒背景のイニシャルSVGを返す
     */
    public function getAvatarUrl(): string
    {
        if ($this->avatar_filename) {
            return Storage::url('avatars/' . $this->avatar_filename);
        }
        $initial = htmlspecialchars(mb_strtoupper(mb_substr($this->name, 0, 1)), ENT_XML1);
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><filter id="g"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100" height="100" fill="#333"/><text x="50" y="50" dominant-baseline="central" text-anchor="middle" font-family="sans-serif" font-size="50" fill="#6ee7b7" filter="url(#g)">' . $initial . '</text></svg>';
        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
}

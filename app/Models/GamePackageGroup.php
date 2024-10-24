<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GamePackageGroup extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'sort_order' => 0,
    ];

    /**
     * タイトルを取得
     *
     * @return BelongsToMany
     */
    public function titles(): BelongsToMany
    {
        return $this->belongsToMany(GameTitle::class, GameTitlePackageGroupLink::class);
    }

    /**
     * パッケージを取得
     *
     * @return BelongsToMany
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(GamePackage::class, GamePackageGroupPackageLink::class);
    }
}

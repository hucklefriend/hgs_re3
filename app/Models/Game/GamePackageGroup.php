<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class GamePackageGroup extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

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

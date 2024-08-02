<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GamePackageGroupPackageLink extends \Eloquent
{
    protected $primaryKey = ['game_package_group_id', 'game_package_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * パッケージグループ
     *
     * @return BelongsTo
     */
    public function packageGroup(): BelongsTo
    {
        return $this->belongsTo(GamePackageGroup::class);
    }

    /**
     * パッケージ
     *
     * @return BelongsTo
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(GamePackage::class);
    }
}

<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameTitlePackageGroupLink extends \Eloquent
{
    protected $primaryKey = ['game_title_id', 'game_package_group_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * タイトル
     *
     * @return BelongsTo
     */
    public function title(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class);
    }

    /**
     * パッケージグループ
     *
     * @return BelongsTo
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(GamePackageGroup::class);
    }
}

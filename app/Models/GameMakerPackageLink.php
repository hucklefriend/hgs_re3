<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameMakerPackageLink extends Model
{
    protected $primaryKey = ['game_maker_id', 'game_package_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * メーカー
     *
     * @return BelongsTo
     */
    public function maker(): BelongsTo
    {
        return $this->belongsTo(GameMaker::class);
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

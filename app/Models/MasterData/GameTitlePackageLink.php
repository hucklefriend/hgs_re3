<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameTitlePackageLink extends \Eloquent
{
    protected $primaryKey = ['game_title_id', 'game_package_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    public function soft(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(GamePackage::class);
    }
}

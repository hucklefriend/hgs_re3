<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameFranchiseTitleLink extends Model
{
    protected $primaryKey = ['game_franchise_id', 'game_soft_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    public function franchise(): BelongsTo
    {
        return $this->belongsTo(GameFranchise::class);
    }

    public function soft(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class);
    }
}

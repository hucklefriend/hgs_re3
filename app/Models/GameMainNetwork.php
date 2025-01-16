<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameMainNetwork extends \Eloquent
{
    public $incrementing = false;
    protected $primaryKey = 'game_franchise_id';
    protected $fillable = ['game_franchise_id', 'x', 'y'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * フランチャイズを取得
     *
     * @return BelongsTo
     */
    public function franchise(): BelongsTo
    {
        return $this->belongsTo(GameFranchise::class, 'game_franchise_id');
    }
}

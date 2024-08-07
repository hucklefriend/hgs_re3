<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameFranchiseMediaMixLink extends \Eloquent
{
    protected $primaryKey = ['game_franchise_id', 'game_media_mix_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * フランチャイズ
     *
     * @return BelongsTo
     */
    public function franchise(): BelongsTo
    {
        return $this->belongsTo(GameFranchise::class);
    }

    /**
     * メディアミックス
     *
     * @return BelongsTo
     */
    public function mediaMix(): BelongsTo
    {
        return $this->belongsTo(GameMediaMix::class);
    }
}

<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class GameMediaMixGroupMediaMixLink extends \Eloquent
{
    protected $primaryKey = ['game_media_mix_group_id', 'game_media_mix_id'];
    protected $hidden = ['created_at', 'updated_at'];
    public $incrementing = false;

    /**
     * メディアミックスグループ
     *
     * @return BelongsTo
     */
    public function mediaMixGroup(): BelongsTo
    {
        return $this->belongsTo(GameMediaMixGroup::class);
    }

    /**
     * メディアミックス
     *
     * @return BelongsTo
     */
    public function mediaMixes(): BelongsTo
    {
        return $this->belongsTo(GameMediaMix::class);
    }
}

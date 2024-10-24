<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameTitleSynonym extends \Eloquent
{
    public $incrementing = false;
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * タイトルを取得
     *
     * @return BelongsTo
     */
    public function titles(): BelongsTo
    {
        return $this->belongsTo(GameTitle::class, 'game_title_id');
    }
}

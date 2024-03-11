<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GameTitleSynonym extends \Eloquent
{
    public $incrementing = false;
    protected $fillable = ['game_title_id', 'synonym'];
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameMakerSynonym extends Model
{
    public $incrementing = false;
    protected $fillable = ['game_maker_id', 'synonym'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * メーカー
     *
     * @return BelongsTo
     */
    public function maker(): BelongsTo
    {
        return $this->belongsTo(GameMaker::class, 'game_maker_id');
    }
}

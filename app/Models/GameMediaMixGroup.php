<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameMediaMixGroup extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * フランチャイズ
     *
     * @return belongsTo
     */
    public function franchise(): belongsTo
    {
        return $this->BelongsTo(GameFranchise::class, 'game_franchise_id');
    }

    /**
     * メディアミックスを取得
     *
     * @return HasMany
     */
    public function mediaMixes(): HasMany
    {
        return $this->HasMany(GameMediaMix::class);
    }
}

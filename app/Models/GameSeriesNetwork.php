<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameSeriesNetwork extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];
}

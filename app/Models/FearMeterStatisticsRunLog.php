<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FearMeterStatisticsRunLog extends Model
{
    protected $table = 'fear_meter_statistics_run_log';

    protected $fillable = [
        'last_completed_at',
    ];

    protected $casts = [
        'last_completed_at' => 'datetime',
    ];
}

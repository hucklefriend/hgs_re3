<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Information extends Model
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array キャスト
     */
    protected $casts = [
        'open_at'  => 'datetime',
        'close_at' => 'datetime',
    ];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'head'        => '',
        'header_text' => '',
        'priority'    => 100,
    ];
}

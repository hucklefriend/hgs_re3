<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Information extends \Eloquent
{
    protected $guarded = ['id'];
    protected $hidden = ['created_at', 'updated_at'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'head'     => '',
        'body'     => '',
        'priority' => 100,
    ];
}

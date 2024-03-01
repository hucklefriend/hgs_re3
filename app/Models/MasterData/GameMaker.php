<?php
/**
 * ORM: game_companies
 */

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GameMaker extends Model
{
    protected $guarded = ['id'];

    /**
     * @var array デフォルト値
     */
    protected $attributes = [
        'name'        => '',
        'acronym'     => '',
        'phonetic'    => '',
    ];
}

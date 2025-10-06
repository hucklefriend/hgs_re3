<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameMainNetworkParam extends Model
{
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = ['id', 'val'];
    protected $hidden = ['created_at', 'updated_at'];

    const PARAM_LEFT = 1;
    const PARAM_RIGHT = 2;
    const PARAM_TOP = 3;
    const PARAM_BOTTOM = 4;

    /**
     * 左端のX座尿を取得
     *
     * @return int|null
     */
    public static function getLeft(): ?int
    {
        $obj = self::where('id', self::PARAM_LEFT)->first();
        return $obj ? intval($obj->val) : null;
    }

    /**
     * 右端のX座尿を取得
     *
     * @return int|null
     */
    public static function getRight(): ?int
    {
        $obj = self::where('id', self::PARAM_RIGHT)->first();
        return $obj ? intval($obj->val) : null;
    }

    /**
     * 上端のY座尿を取得
     *
     * @return int|null
     */
    public static function getTop(): ?int
    {
        $obj = self::where('id', self::PARAM_TOP)->first();
        return $obj ? intval($obj->val) : null;
    }

    /**
     * 下端のY座尿を取得
     *
     * @return int|null
     */
    public static function getBottom(): ?int
    {
        $obj = self::where('id', self::PARAM_BOTTOM)->first();
        return $obj ? intval($obj->val) : null;
    }

    /**
     * ネットワークの矩形を保存
     *
     * @param int $left
     * @param int $right
     * @param int $top
     * @param int $bottom
     */
    public static function saveNetworkRect(int $left, int $right, int $top, int $bottom): void
    {
        $obj = self::find(self::PARAM_LEFT);
        if ($obj) {
            $obj->val = $left;
            $obj->save();
        } else {
            self::create(['id' => self::PARAM_LEFT, 'val' => $left]);
        }

        $obj = self::find(self::PARAM_RIGHT);
        if ($obj) {
            $obj->val = $right;
            $obj->save();
        } else {
            self::create(['id' => self::PARAM_RIGHT, 'val' => $right]);
        }

        $obj = self::find(self::PARAM_TOP);
        if ($obj) {
            $obj->val = $top;
            $obj->save();
        } else {
            self::create(['id' => self::PARAM_TOP, 'val' => $top]);
        }

        $obj = self::find(self::PARAM_BOTTOM);
        if ($obj) {
            $obj->val = $bottom;
            $obj->save();
        } else {
            self::create(['id' => self::PARAM_BOTTOM, 'val' => $bottom]);
        }
    }
}

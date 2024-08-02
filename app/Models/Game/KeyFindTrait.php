<?php

namespace App\Models\Game;

trait KeyFindTrait
{
    /**
     * keyからレコードを取得
     *
     * @param string $key
     * @return ?self
     */
    public static function findByKey(string $key): ?self
    {
        return self::where('key', $key)->first();
    }
}

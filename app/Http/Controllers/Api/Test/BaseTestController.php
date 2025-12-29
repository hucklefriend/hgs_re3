<?php

namespace App\Http\Controllers\Api\Test;

class BaseTestController
{
    /**
     * コンストラクタ
     * production環境の場合は404を返す
     */
    public function __construct()
    {
        if (app()->environment('production')) {
            abort(404);
        }
    }
}


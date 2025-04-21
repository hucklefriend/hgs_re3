<?php

namespace Tests;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class TestCase extends BaseTestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        
        // テスト開始時にスキーマファイルからテーブルを復元
        $schemaPath = database_path('schema/mariadb-schema.sql');
        if (file_exists($schemaPath)) {
            $sql = file_get_contents($schemaPath);
            DB::unprepared($sql);
        }
    }
}

<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TestFailedNotification;
use Tests\Subscribers\TestFailedSubscriber;
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

    protected function tearDown(): void
    {
        $failedSubscriber = TestFailedSubscriber::getInstance();
        if (!empty($failedSubscriber->getFailures())) {
            Notification::route('slack', config('services.slack.test_error_webhook_url'))
                ->notify(new TestFailedNotification($failedSubscriber->getFailures()));

            $failedSubscriber->clearFailures();
        }

        parent::tearDown();
    }
}

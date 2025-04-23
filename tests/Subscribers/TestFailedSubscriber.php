<?php

namespace Tests\Subscribers;

use PHPUnit\Event\Test\Failed;
use PHPUnit\Event\Test\FailedSubscriber;

class TestFailedSubscriber implements FailedSubscriber
{
    private static ?self $instance = null;

    public static function getInstance(): self
    {
        return self::$instance ??= new self();
    }

    private array $failures = [];

    /**
     * テスト失敗を記録
     */
    public function notify(Failed $event): void
    {
        $this->failures[] = [
            'test' => $event->test()->name(),
            'message' => $event->throwable()->message()
        ];
    }

    /**
     * 記録された失敗を取得
     */
    public function getFailures(): array
    {
        return $this->failures;
    }

    public function clearFailures(): void
    {
        $this->failures = [];
    }
} 
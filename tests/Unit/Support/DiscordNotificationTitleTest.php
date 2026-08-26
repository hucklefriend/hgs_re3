<?php

namespace Tests\Unit\Support;

use App\Support\DiscordNotificationTitle;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class DiscordNotificationTitleTest extends TestCase
{
    #[DataProvider('environmentTitles')]
    public function test_it_adds_an_environment_name_only_outside_production(
        string $environment,
        string $expected,
    ): void {
        $this->assertSame(
            $expected,
            DiscordNotificationTitle::withEnvironment('新しいお問い合わせが届きました', $environment),
        );
    }

    /** @return array<string, array{string, string}> */
    public static function environmentTitles(): array
    {
        return [
            'production' => ['production', '新しいお問い合わせが届きました'],
            'local' => ['local', '【ローカル】新しいお問い合わせが届きました'],
            'staging' => ['staging', '【STG】新しいお問い合わせが届きました'],
            'other non-production environment' => ['testing', '【TESTING】新しいお問い合わせが届きました'],
        ];
    }
}

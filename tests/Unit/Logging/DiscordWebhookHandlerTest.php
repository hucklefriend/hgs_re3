<?php

namespace Tests\Unit\Logging;

use App\Enums\DiscordChannel;
use App\Logging\DiscordWebhookHandler;
use App\Services\Discord\DiscordWebhookService;
use Illuminate\Container\Container;
use Illuminate\Foundation\Application;
use Monolog\Level;
use Monolog\LogRecord;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class DiscordWebhookHandlerTest extends TestCase
{
    #[DataProvider('environmentTitles')]
    public function test_it_adds_the_environment_name_to_log_notifications(
        string $environment,
        string $expectedTitle,
    ): void {
        $app = new Application(dirname(__DIR__, 3));
        $app->instance('env', $environment);

        $service = new class extends DiscordWebhookService
        {
            public string $content = '';

            public function to(DiscordChannel $channel): static
            {
                return $this;
            }

            public function username(string $name): static
            {
                return $this;
            }

            public function send(string $content): void
            {
                $this->content = $content;
            }
        };
        $app->instance(DiscordWebhookService::class, $service);

        $handler = new DiscordWebhookHandler(Level::Warning);
        $handler->handle(new LogRecord(
            datetime: new \DateTimeImmutable,
            channel: 'testing',
            level: Level::Error,
            message: 'テストエラー',
        ));

        $this->assertStringStartsWith("{$expectedTitle}\n", $service->content);

        Container::setInstance(null);
    }

    /** @return array<string, array{string, string}> */
    public static function environmentTitles(): array
    {
        return [
            'production' => ['production', '[ERROR] ログが出力されました'],
            'local' => ['local', '【ローカル】[ERROR] ログが出力されました'],
            'staging' => ['staging', '【STG】[ERROR] ログが出力されました'],
        ];
    }
}

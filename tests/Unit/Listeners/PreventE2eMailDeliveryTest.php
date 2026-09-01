<?php

namespace Tests\Unit\Listeners;

use App\Listeners\PreventE2eMailDelivery;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Mail\Events\MessageSending;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mime\Email;

class PreventE2eMailDeliveryTest extends TestCase
{
    #[DataProvider('deliveryDecisions')]
    public function test_it_only_prevents_e2e_mail_delivery_outside_production(
        bool $production,
        string $recipient,
        ?bool $expected,
    ): void {
        $app = $this->createMock(Application::class);
        $app->expects($this->once())
            ->method('environment')
            ->with('production')
            ->willReturn($production);

        $message = (new Email)->to($recipient);
        $listener = new PreventE2eMailDelivery($app);

        $this->assertSame($expected, $listener->handle(new MessageSending($message)));
    }

    /** @return array<string, array{bool, string, bool|null}> */
    public static function deliveryDecisions(): array
    {
        return [
            'local E2E recipient' => [false, 'user@playwright.invalid', false],
            'staging-style E2E recipient' => [false, 'USER@PLAYWRIGHT.INVALID', false],
            'normal non-production recipient' => [false, 'user@example.com', null],
            'production E2E recipient' => [true, 'user@playwright.invalid', null],
        ];
    }
}

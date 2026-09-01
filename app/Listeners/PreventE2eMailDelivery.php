<?php

namespace App\Listeners;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Mail\Events\MessageSending;

class PreventE2eMailDelivery
{
    public const DOMAIN = 'playwright.invalid';

    public function __construct(private readonly Application $app) {}

    public function handle(MessageSending $event): ?bool
    {
        if ($this->app->environment('production')) {
            return null;
        }

        foreach ($event->message->getTo() as $recipient) {
            $domain = strtolower((string) strrchr($recipient->getAddress(), '@'));
            if ($domain === '@'.self::DOMAIN) {
                return false;
            }
        }

        return null;
    }
}

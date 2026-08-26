<?php

namespace App\Support;

final class DiscordNotificationTitle
{
    public static function withEnvironment(string $title, string $environment): string
    {
        if ($environment === 'production') {
            return $title;
        }

        $environmentName = match ($environment) {
            'local' => 'ローカル',
            'staging' => 'STG',
            default => strtoupper($environment),
        };

        return "【{$environmentName}】{$title}";
    }
}

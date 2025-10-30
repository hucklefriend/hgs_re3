<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class TestFailedNotification extends Notification
{
    use Queueable;

    /**
     * @param array $failures
     */
    public function __construct(private array $failures)
    {
    }

    /**
     * 通知チャンネルの取得
     */
    public function via(object $notifiable): array
    {
        return ['slack'];
    }

    /**
     * Slack通知の作成
     */
    public function toSlack(object $notifiable): SlackMessage
    {
        $message = new SlackMessage;
        $message->error()
            ->content('テストが失敗しました :warning:');

        foreach ($this->failures as $failure) {
            $message->attachment(function ($attachment) use ($failure) {
                $attachment->title('失敗したテスト')
                    ->fields([
                        'テストケース' => $failure['test'],
                        'エラー' => $failure['message'],
                    ]);
            });
        }

        return $message;
    }
} 
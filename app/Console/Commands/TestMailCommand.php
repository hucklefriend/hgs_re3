<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class TestMailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'メール送信のテストを実行します';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $to = 'webmaster@horrorgame.net';
        $subject = 'テスト';
        $body = 'テスト';
        
        $mailer = Config::get('mail.default');

        $this->info("メール送信を試みます...");
        $this->line("現在のメール設定: {$mailer}");
        $this->line("宛先: {$to}");
        $this->line("件名: {$subject}");

        try {
            Mail::raw($body, function ($message) use ($to, $subject) {
                $message->to($to)
                    ->subject($subject);
            });

            if ($mailer === 'log') {
                $logPath = storage_path('logs/laravel-' . date('Y-m-d') . '.log');
                $this->warn('⚠ 現在の設定では、メールは実際には送信されません（MAIL_MAILER=log）');
                $this->info("✓ メールはログファイルに記録されました: {$logPath}");
                $this->line("実際のメールを送信するには、.envファイルで MAIL_MAILER=smtp に変更してください。");
            } else {
                $this->info('✓ メールの送信に成功しました！');
            }
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('✗ メールの送信に失敗しました: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

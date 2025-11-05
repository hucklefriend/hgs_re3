<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class InvalidateUnverifiedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:invalidate-unverified';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '10分以内にメール確認が完了していないアカウントを無効化（削除）する';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tenMinutesAgo = now()->subMinutes(10);

        // メール確認が完了しておらず、10分以上経過しているアカウントを取得
        $users = User::whereNull('email_verified_at')
            ->whereNotNull('email_verification_sent_at')
            ->where('email_verification_sent_at', '<=', $tenMinutesAgo)
            ->get();

        if ($users->isEmpty()) {
            $this->info('無効化対象のアカウントはありません。');
            return 0;
        }

        $count = 0;
        foreach ($users as $user) {
            $user->delete();
            $count++;
            $this->info("ユーザー ID: {$user->id} (Email: {$user->email}) を無効化しました。");
        }

        $this->info("合計 {$count} 件のアカウントを無効化しました。");
        return 0;
    }
}

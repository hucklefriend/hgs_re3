<?php

namespace App\Console\Commands;

use App\Models\EmailChangeRequest;
use Illuminate\Console\Command;

class CleanupExpiredEmailChangeRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email-change:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '有効期限を過ぎたメールアドレス変更リクエストを削除する';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $now = now();

        $count = EmailChangeRequest::where('expires_at', '<=', $now)->delete();

        if ($count === 0) {
            $this->info('削除対象のレコードはありません。');
            return self::SUCCESS;
        }

        $this->info("{$count} 件のメールアドレス変更リクエストを削除しました。");

        return self::SUCCESS;
    }
}



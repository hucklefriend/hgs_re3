<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PurgeWithdrawnUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:purge-withdrawn {--dry-run : 削除せず対象件数のみを確認します}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '退会から100日経過したユーザーを削除します。';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $threshold = now()->subDays(100);
        $dryRun = (bool) $this->option('dry-run');

        $query = User::whereNotNull('withdrawn_at')
            ->where('withdrawn_at', '<=', $threshold);

        $total = (clone $query)->count();

        if ($total === 0) {
            $this->info('削除対象のユーザーはいません。');
            return self::SUCCESS;
        }

        $this->info("削除対象ユーザー数: {$total} 件");

        if ($dryRun) {
            $this->info('ドライランのため削除処理は実行しません。');
            return self::SUCCESS;
        }

        $deletedCount = 0;

        $query->chunkById(100, function ($users) use (&$deletedCount) {
            foreach ($users as $user) {
                $user->delete();
                $deletedCount++;
            }

            $this->info("現在までに {$deletedCount} 件を削除しました。");
        });

        $this->info("合計 {$deletedCount} 件のユーザーを削除しました。");

        return self::SUCCESS;
    }
}



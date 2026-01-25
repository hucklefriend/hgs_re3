<?php

namespace App\Console\Commands;

use App\Models\GameTitleFearMeterStatistic;
use App\Models\UserGameTitleFearMeter;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class RecalculateFearMeterStatisticsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fear-meter:recalculate-statistics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'UserGameTitleFearMeterに登録されている全てのゲームタイトルの怖さメーター統計を再集計する';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // UserGameTitleFearMeterから重複なしのgame_title_idを取得
        $gameTitleIds = UserGameTitleFearMeter::distinct()
            ->pluck('game_title_id')
            ->toArray();

        if (empty($gameTitleIds)) {
            $message = '評価データが存在しないため、再集計する対象がありません。';
            $this->info($message);
            Log::info($message);
            return 0;
        }

        $totalCount = count($gameTitleIds);
        $message = "合計 {$totalCount} 件のゲームタイトルの統計を再集計します。";
        $this->info($message);
        Log::info($message);

        $bar = $this->output->createProgressBar($totalCount);
        $bar->start();

        $successCount = 0;
        $errorCount = 0;

        foreach ($gameTitleIds as $gameTitleId) {
            try {
                // インスタンスを作成または取得
                $statistic = GameTitleFearMeterStatistic::firstOrNew(['game_title_id' => $gameTitleId]);
                $statistic->game_title_id = $gameTitleId;
                
                // 再集計
                $statistic->recalculate();
                $successCount++;
            } catch (\Exception $e) {
                $errorCount++;
                $errorMessage = "ゲームタイトル ID: {$gameTitleId} の再集計中にエラーが発生しました: " . $e->getMessage();
                $this->newLine();
                $this->error($errorMessage);
                Log::error($errorMessage, [
                    'game_title_id' => $gameTitleId,
                    'exception' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $completionMessage = "再集計が完了しました。成功: {$successCount} 件";
        $this->info("再集計が完了しました。");
        $this->info("成功: {$successCount} 件");
        Log::info($completionMessage, [
            'success_count' => $successCount,
            'error_count' => $errorCount,
        ]);

        if ($errorCount > 0) {
            $errorMessage = "エラー: {$errorCount} 件";
            $this->warn($errorMessage);
            Log::warning($errorMessage, ['error_count' => $errorCount]);
        }

        return 0;
    }
}

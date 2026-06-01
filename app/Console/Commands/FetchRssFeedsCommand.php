<?php

namespace App\Console\Commands;

use App\Enums\RssSource;
use App\Services\Rss\RssFetchService;
use Illuminate\Console\Command;

class FetchRssFeedsCommand extends Command
{
    protected $signature = 'rss:fetch {--source= : ソース指定（4gamer/automaton/game_watch/game_spark、デバッグ用）}';

    protected $description = 'RSSフィードを取得してタイムラインに登録する';

    public function handle(RssFetchService $fetchService): int
    {
        $sourceValue = $this->option('source');

        if ($sourceValue !== null) {
            $source = RssSource::tryFrom($sourceValue);
            if (!$source) {
                $this->error("不正なソース値: {$sourceValue}");
                $this->line('有効な値: ' . implode(', ', array_column(RssSource::cases(), 'value')));
                return Command::FAILURE;
            }
            $this->info("RSSソース取得開始: {$source->label()}");
            $fetchService->fetchBySource($source);
            $this->info('完了');
            return Command::SUCCESS;
        }

        $this->info('全RSSソース取得開始');
        $fetchService->fetchAll();
        $this->info('完了');

        return Command::SUCCESS;
    }
}

<?php

namespace App\Console\Commands;

use App\Models\OgpCache;
use Illuminate\Console\Command;

class UpdateOgpCachesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-ogp-caches';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $ogps = OgpCache::orderBy('updated_at', 'asc')->take(10)->get();

        foreach ($ogps as $ogp) {
            $ogp->fetch()->saveOrDelete();

            sleep(1);
        }
    }
}

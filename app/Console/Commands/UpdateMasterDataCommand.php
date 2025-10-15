<?php

namespace App\Console\Commands;

use App\Models\GameFranchise;
use App\Models\GameMaker;
use App\Models\GameTitle;
use Illuminate\Console\Command;

class UpdateMasterDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:update-master-data';

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
        foreach (GameFranchise::all() as $franchise) {
            $franchise->setRating();
            $franchise->save();
        }

        foreach (GameMaker::all() as $maker) {
            $maker->setRating();
            $maker->save();
        }

        foreach (GameTitle::all() as $title) {
            $title->setFirstReleaseInt()->save();
        }
    }
}

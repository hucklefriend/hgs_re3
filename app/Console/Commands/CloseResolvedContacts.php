<?php

namespace App\Console\Commands;

use App\Enums\ContactStatus;
use App\Models\Contact;
use Illuminate\Console\Command;

class CloseResolvedContacts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contact:close-resolved';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Close contacts that have been resolved for 2 weeks';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $twoWeeksAgo = now()->subWeeks(2);

        // ステータスが完了で、resolved_atが2週間前より古いものを取得
        $contacts = Contact::where('status', ContactStatus::RESOLVED->value)
            ->whereNotNull('resolved_at')
            ->where('resolved_at', '<=', $twoWeeksAgo)
            ->get();

        if ($contacts->isEmpty()) {
            $this->info('クローズ対象の問い合わせはありません。');
            return 0;
        }

        $count = 0;
        foreach ($contacts as $contact) {
            $contact->update(['status' => ContactStatus::CLOSED]);
            $count++;
            $this->info("問い合わせ ID: {$contact->id} をクローズしました。");
        }

        $this->info("合計 {$count} 件の問い合わせをクローズしました。");
        return 0;
    }
}

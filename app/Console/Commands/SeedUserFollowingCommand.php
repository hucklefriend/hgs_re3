<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SeedUserFollowingCommand extends Command
{
    protected $signature = 'test:seed-following {user_id : フォローさせるユーザーのID}';

    protected $description = '指定ユーザーがランダムな5人をフォローするテストデータを作成します。';

    public function handle(): int
    {
        $userId = (int) $this->argument('user_id');
        $user = User::find($userId);

        if (!$user) {
            $this->error("ID={$userId} のユーザーが見つかりません。");
            return self::FAILURE;
        }

        $candidates = User::where('id', '!=', $userId)
            ->inRandomOrder()
            ->limit(5)
            ->pluck('id')
            ->toArray();

        if (empty($candidates)) {
            $this->warn('フォロー対象となる他のユーザーが存在しません。');
            return self::FAILURE;
        }

        $created = 0;

        foreach ($candidates as $followingId) {
            $exists = UserFollow::where('follower_id', $userId)
                ->where('following_id', $followingId)
                ->exists();

            if (!$exists) {
                UserFollow::create([
                    'follower_id'  => $userId,
                    'following_id' => $followingId,
                    'created_at'   => Carbon::now(),
                ]);
                $created++;
            }
        }

        $this->info("完了: {$user->name}（ID={$userId}）が {$created} 人をフォローしました。");

        return self::SUCCESS;
    }
}

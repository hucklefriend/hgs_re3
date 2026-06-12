<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SeedUserFollowersCommand extends Command
{
    protected $signature = 'test:seed-followers {user_id : フォローされるユーザーのID}';

    protected $description = '指定ユーザーにランダムな5人のフォロワーを作成するテストデータを作成します。';

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
            $this->warn('フォロワー候補となる他のユーザーが存在しません。');
            return self::FAILURE;
        }

        $created = 0;

        foreach ($candidates as $followerId) {
            $exists = UserFollow::where('follower_id', $followerId)
                ->where('following_id', $userId)
                ->exists();

            if (!$exists) {
                UserFollow::create([
                    'follower_id'  => $followerId,
                    'following_id' => $userId,
                    'created_at'   => Carbon::now(),
                ]);
                $created++;
            }
        }

        $this->info("完了: {$user->name}（ID={$userId}）に {$created} 人のフォロワーを追加しました。");

        return self::SUCCESS;
    }
}

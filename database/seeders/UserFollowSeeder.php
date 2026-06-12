<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class UserFollowSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::inRandomOrder()->limit(10)->get();

        if ($users->count() < 2) {
            $this->command->warn('ユーザーが2人以上存在しないためフォロー関係を作成できませんでした。先に UserSeeder を実行してください。');
            return;
        }

        $allUserIds = $users->pluck('id')->toArray();
        $created = 0;

        foreach ($users as $follower) {
            $candidates = array_values(array_diff($allUserIds, [$follower->id]));
            $followCount = min(5, count($candidates));
            $targetIds = (array) array_rand(array_flip($candidates), $followCount);

            foreach ($targetIds as $followingId) {
                $exists = UserFollow::where('follower_id', $follower->id)
                    ->where('following_id', $followingId)
                    ->exists();

                if (!$exists) {
                    UserFollow::create([
                        'follower_id'  => $follower->id,
                        'following_id' => $followingId,
                        'created_at'   => Carbon::now(),
                    ]);
                    $created++;
                }
            }
        }

        $this->command->info("UserFollowSeeder 完了: {$created} 件のフォロー関係を作成しました。");
    }
}

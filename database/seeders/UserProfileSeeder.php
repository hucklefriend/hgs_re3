<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserProfileSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereNull('bio')->get();

        if ($users->isEmpty()) {
            $this->command->warn('プロフィール未設定のユーザーが存在しません。');
            return;
        }

        foreach ($users as $user) {
            $user->bio = fake('ja_JP')->realText(fake()->numberBetween(20, 100));
            $user->save();
        }

        $this->command->info("UserProfileSeeder 完了: {$users->count()} 件のユーザーに自己紹介を設定しました。");
    }
}

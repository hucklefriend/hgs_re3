<?php

namespace Tests\Feature\Console;

use App\Models\GameTitle;
use App\Models\User;
use App\Models\UserGameTitleReview;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * 前提: テスト用DB（hgs_re3_test）に game_titles が少なくとも1件存在すること。
 */
class PurgeWithdrawnUsersCommandTest extends TestCase
{
    use DatabaseTransactions;

    private array $ogpFilesToCleanup = [];

    protected function tearDown(): void
    {
        foreach ($this->ogpFilesToCleanup as $path) {
            if (File::exists($path)) {
                File::delete($path);
            }
        }

        parent::tearDown();
    }

    public function test_purge_deletes_user_and_associated_files_after_100_days(): void
    {
        Storage::fake('public');

        $gameTitleId = GameTitle::orderBy('id')->value('id');
        if (!$gameTitleId) {
            $this->markTestSkipped('テストには少なくとも1件の既存 game_titles が必要です。');
        }

        // 100日超過済みユーザー(削除対象)
        $targetUser = User::factory()->create([
            'withdrawn_at' => now()->subDays(101),
            'avatar_filename' => 'target-avatar.png',
        ]);
        Storage::disk('public')->put('avatars/target-avatar.png', 'dummy-avatar-content');

        $targetReview = UserGameTitleReview::factory()->create([
            'user_id' => $targetUser->id,
            'game_title_id' => $gameTitleId,
        ]);
        $ogpFilename = 'review_' . $targetReview->id . '_test.png';
        $ogpPath = public_path('img/review/' . $ogpFilename);
        File::ensureDirectoryExists(dirname($ogpPath));
        File::put($ogpPath, 'dummy-ogp-content');
        $this->ogpFilesToCleanup[] = $ogpPath;
        $targetReview->update(['ogp_image_filename' => $ogpFilename]);

        // 100日未満の退会ユーザー(削除対象外)
        $recentlyWithdrawnUser = User::factory()->create([
            'withdrawn_at' => now()->subDays(10),
        ]);

        // 退会していないユーザー(削除対象外)
        $activeUser = User::factory()->create([
            'withdrawn_at' => null,
        ]);

        $this->artisan('user:purge-withdrawn')->assertSuccessful();

        $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
        $this->assertDatabaseMissing('user_game_title_reviews', ['id' => $targetReview->id]);
        Storage::disk('public')->assertMissing('avatars/target-avatar.png');
        $this->assertFileDoesNotExist($ogpPath);

        $this->assertDatabaseHas('users', ['id' => $recentlyWithdrawnUser->id]);
        $this->assertDatabaseHas('users', ['id' => $activeUser->id]);
    }

    public function test_dry_run_does_not_delete_anything(): void
    {
        $gameTitleId = GameTitle::orderBy('id')->value('id');
        if (!$gameTitleId) {
            $this->markTestSkipped('テストには少なくとも1件の既存 game_titles が必要です。');
        }

        $targetUser = User::factory()->create([
            'withdrawn_at' => now()->subDays(101),
        ]);

        $this->artisan('user:purge-withdrawn', ['--dry-run' => true])->assertSuccessful();

        $this->assertDatabaseHas('users', ['id' => $targetUser->id]);
    }
}

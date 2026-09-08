<?php

namespace Tests\Feature\User;

use App\Enums\SocialAccountProvider;
use App\Models\GameTitle;
use App\Models\SocialAccount;
use App\Models\User;
use Tests\TestCase;

class MyNodeBreadcrumbTest extends TestCase
{
    public function test_my_node_menu_destinations_include_my_node_in_the_breadcrumb(): void
    {
        $user = User::factory()->create();
        $destinations = [
            'User.MyNode.Following' => 'フォロー中',
            'User.MyNode.Followers' => 'フォロワーリスト',
            'User.MyNode.Blocking' => 'ブロック中',
            'User.MyNode.Muting' => 'ミュート中',
            'User.Follow.FavoriteTitles' => 'お気に入りタイトル',
            'User.FearMeter.Index' => '怖さメーター一覧',
            'User.Review.Index' => 'マイレビュー',
            'User.MyNode.ReviewLikes' => 'いいねしたレビュー',
            'User.MyNode.TimelineSettings' => 'タイムライン設定',
            'User.MyNode.Profile' => 'プロフィール設定',
            'User.MyNode.Email' => 'メールアドレス変更',
            'User.MyNode.Password' => 'パスワード変更',
            'User.MyNode.LoginSettings' => 'ログイン設定',
            'User.MyNode.SocialAccounts' => '外部サービス連携',
            'User.MyNode.Withdraw' => '退会',
        ];

        foreach ($destinations as $routeName => $pageTitle) {
            $response = $this->actingAs($user)->get(route($routeName));

            $response->assertOk();
            $response->assertSeeInOrder([
                '<nav class="site-breadcrumb" aria-label="パンくず">',
                route('Root'),
                'ROOT',
                route('User.MyNode.Top'),
                'MY NODE',
                $pageTitle,
            ], false);
        }
    }

    public function test_password_setup_variant_includes_my_node_in_the_breadcrumb(): void
    {
        $user = User::factory()->create(['password' => null]);
        SocialAccount::create([
            'user_id' => $user->id,
            'provider' => SocialAccountProvider::GitHub,
            'provider_user_id' => 'breadcrumb-test-user',
        ]);

        $response = $this->actingAs($user)->get(route('User.MyNode.Password'));

        $response->assertOk();
        $response->assertSeeInOrder([
            '<nav class="site-breadcrumb" aria-label="パンくず">',
            route('Root'),
            'ROOT',
            route('User.MyNode.Top'),
            'MY NODE',
            'パスワード設定',
        ], false);
    }

    public function test_favorite_titles_use_the_franchise_title_lineup_design(): void
    {
        $user = User::factory()->create();
        $title = GameTitle::query()->firstOrFail();
        $user->favoriteGameTitles()->attach($title->id, [
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('User.Follow.FavoriteTitles'));

        $response->assertOk();
        $response->assertSee(
            '<section class="lineup-franchise favorite-title-catalog" id="favorite-titles-tree-node">',
            false
        );
        $response->assertSee('<div class="lineup-franchise__entries">', false);
        $response->assertDontSee('お気に入りに登録されているタイトル一覧です。');
        $response->assertSee(
            '<span class="lineup-result-signal" aria-hidden="true"></span><b>'.e($title->name).'</b>',
            false
        );
        $response->assertDontSee('class="node tree-node" id="favorite-titles-tree-node"', false);
    }
}

<?php

namespace Tests\Feature\User;

use App\Models\User;
use App\Models\UserFollow;
use App\Models\UserBlock;
use App\Models\UserMute;
use Tests\TestCase;

class MyNodeFollowingTest extends TestCase
{
    public function test_following_list_renders_action_menu_with_current_mute_state(): void
    {
        $viewer = User::factory()->create();
        $mutedUser = User::factory()->create(['name' => 'ミュート対象']);
        $unmutedUser = User::factory()->create(['name' => '通常対象']);

        UserFollow::create(['follower_id' => $viewer->id, 'following_id' => $mutedUser->id]);
        UserFollow::create(['follower_id' => $viewer->id, 'following_id' => $unmutedUser->id]);
        UserMute::create(['muter_id' => $viewer->id, 'muted_id' => $mutedUser->id]);

        $response = $this->actingAs($viewer)->get(route('User.MyNode.Following'));

        $response->assertOk();
        $response->assertSee('ミュート対象の操作メニュー');
        $response->assertSee('通常対象の操作メニュー');
        $response->assertSee('ミュートを解除');
        $response->assertSee('ミュートする');
        $response->assertSee('フォローを解除');
        $response->assertSee('ブロックする');
        $response->assertSee('UserActionMenu', false);
    }
    public function test_mute_form_redirects_to_get_and_refresh_does_not_repeat_operation(): void
    {
        $viewer = User::factory()->create();
        $target = User::factory()->create();
        $url = route('User.MyNode.Following.Mute', $target->show_id);
        $attributes = ['muter_id' => $viewer->id, 'muted_id' => $target->id];

        $this->actingAs($viewer)->post($url)
            ->assertStatus(303)->assertRedirect(route('User.MyNode.Following'));
        $this->assertDatabaseHas('user_mutes', $attributes);
        $this->get(route('User.MyNode.Following'))->assertOk();
        $this->get(route('User.MyNode.Following'))->assertOk();
        $this->assertDatabaseHas('user_mutes', $attributes);

        $this->delete($url)->assertStatus(303)->assertRedirect(route('User.MyNode.Following'));
        $this->get(route('User.MyNode.Following'))->assertOk();
        $this->assertDatabaseMissing('user_mutes', $attributes);
    }

    public function test_mute_form_rejects_self_and_missing_users(): void
    {
        $viewer = User::factory()->create();
        $this->actingAs($viewer)->post(route('User.MyNode.Following.Mute', $viewer->show_id))
            ->assertForbidden();
        $this->post(route('User.MyNode.Following.Mute', 'missing-user'))->assertNotFound();
    }
    public function test_other_relationship_lists_share_the_action_menu(): void
    {
        $viewer = User::factory()->create();
        $target = User::factory()->create();
        UserFollow::create(['follower_id' => $target->id, 'following_id' => $viewer->id]);
        UserMute::create(['muter_id' => $viewer->id, 'muted_id' => $target->id]);
        UserBlock::create(['blocker_id' => $viewer->id, 'blocked_id' => $target->id]);

        foreach (['Followers', 'Muting', 'Blocking'] as $list) {
            $response = $this->actingAs($viewer)->get(route('User.MyNode.' . $list));
            $response->assertOk()->assertSee('following-user-entry')->assertSee('UserActionMenu');
            $response->assertDontSee('lineup-result-signal');
            if ($list === 'Blocking') {
                $response->assertDontSee('プロフィールを見る');
                $response->assertSee('ブロックを解除');
            } else {
                $response->assertSee('プロフィールを見る');
            }
        }

        $this->delete(route('User.MyNode.Muting.Mute', $target->show_id))
            ->assertStatus(303)->assertRedirect(route('User.MyNode.Muting'));
        $this->assertDatabaseMissing('user_mutes', ['muter_id' => $viewer->id, 'muted_id' => $target->id]);
        $this->get(route('User.MyNode.Muting'))->assertOk()->assertSee('ミュートしているユーザーはいないようだ。');
    }
}

<?php

namespace Tests\Feature\User;

use App\Models\User;
use App\Services\Timeline\TimelineEventService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Mockery\MockInterface;
use Tests\TestCase;

class MyNodeTopTest extends TestCase
{
    public function test_timeline_is_paginated_on_my_node_top(): void
    {
        $user = User::factory()->create();
        $timelineEvent = [
            'type' => 'user_registered',
            'actor_name' => $user->name,
            'actor_show_id' => $user->show_id,
            'fear_meter_label' => null,
            'note' => null,
            'created_at' => Carbon::parse('2026-09-02 12:00:00'),
        ];
        $paginator = new LengthAwarePaginator([$timelineEvent], 41, 20, 2);

        $this->mock(TimelineEventService::class, function (MockInterface $mock) use ($user, $paginator): void {
            $mock->shouldReceive('fetchForUserPaginated')
                ->once()
                ->with($user->id, 20)
                ->andReturn($paginator);
        });

        $response = $this->actingAs($user)->get(route('User.MyNode.Top', ['page' => 2]));

        $response->assertOk();
        $response->assertSee('あなたのタイムライン');
        $response->assertDontSee('更新情報を見る');
        $response->assertSee(route('User.MyNode.Top', ['page' => 3]), false);

        $this->get('/user/my-node/timeline')->assertNotFound();
    }
}

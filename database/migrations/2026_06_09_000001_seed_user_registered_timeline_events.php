<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $users = DB::table('users')
            ->whereNotNull('sign_up_at')
            ->select('id', 'sign_up_at')
            ->get();

        $rows = $users->map(fn ($u) => [
            'event_type'   => 'user_registered',
            'actor_type'   => 'user',
            'actor_id'     => $u->id,
            'subject_type' => 'user',
            'subject_id'   => $u->id,
            'created_at'   => $u->sign_up_at,
        ])->all();

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('timeline_events')->insert($chunk);
        }
    }

    public function down(): void
    {
        DB::table('timeline_events')
            ->where('event_type', 'user_registered')
            ->delete();
    }
};

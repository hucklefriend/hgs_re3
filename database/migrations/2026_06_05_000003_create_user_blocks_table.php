<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_blocks', function (Blueprint $table) {
            $table->unsignedBigInteger('blocker_id')->comment('ブロックするユーザーID');
            $table->unsignedBigInteger('blocked_id')->comment('ブロックされるユーザーID');
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['blocker_id', 'blocked_id'], 'user_blocks_primary');
            $table->index('blocked_id', 'user_blocks_blocked_idx');

            $table->foreign('blocker_id', 'ub_blocker_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->foreign('blocked_id', 'ub_blocked_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_blocks');
    }
};

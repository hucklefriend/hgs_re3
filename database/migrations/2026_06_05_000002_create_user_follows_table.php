<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_follows', function (Blueprint $table) {
            $table->unsignedBigInteger('follower_id')->comment('フォローするユーザーID');
            $table->unsignedBigInteger('following_id')->comment('フォローされるユーザーID');
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['follower_id', 'following_id'], 'user_follows_primary');
            $table->index('following_id', 'user_follows_following_idx');

            $table->foreign('follower_id', 'uf_follower_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->foreign('following_id', 'uf_following_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_follows');
    }
};

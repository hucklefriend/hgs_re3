<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_mutes', function (Blueprint $table) {
            $table->unsignedBigInteger('muter_id')->comment('ミュートするユーザーID');
            $table->unsignedBigInteger('muted_id')->comment('ミュートされるユーザーID');
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['muter_id', 'muted_id'], 'user_mutes_primary');
            $table->index('muted_id', 'user_mutes_muted_idx');

            $table->foreign('muter_id', 'um_muter_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->foreign('muted_id', 'um_muted_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_mutes');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_game_title_fear_meters', function (Blueprint $table) {
            $table->index(['updated_at', 'game_title_id'], 'user_game_title_fear_meters_updated_at_game_title_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_game_title_fear_meters', function (Blueprint $table) {
            $table->dropIndex('user_game_title_fear_meters_updated_at_game_title_id_index');
        });
    }
};

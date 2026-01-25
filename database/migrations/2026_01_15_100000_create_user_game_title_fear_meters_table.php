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
        Schema::create('user_game_title_fear_meters', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->comment('ユーザーID');
            $table->unsignedInteger('game_title_id')->comment('ゲームタイトルID');
            $table->unsignedTinyInteger('fear_meter')->comment('怖さ評価値（0-4）');
            $table->timestamps();

            $table->primary(['user_id', 'game_title_id'], 'user_game_title_fear_meters_primary');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('game_title_id')->references('id')->on('game_titles')->onDelete('cascade');
            $table->index('user_id');
            $table->index('game_title_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_game_title_fear_meters');
    }
};

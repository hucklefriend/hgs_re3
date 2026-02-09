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
        Schema::create('user_game_title_fear_meter_logs', function (Blueprint $table) {
            $table->id()->comment('ID');
            $table->unsignedBigInteger('user_id')->comment('ユーザーID');
            $table->unsignedInteger('game_title_id')->comment('ゲームタイトルID');
            $table->unsignedTinyInteger('old_fear_meter')->nullable()->comment('変更前の怖さ評価値（0-4、初回登録時はNULL）');
            $table->unsignedTinyInteger('new_fear_meter')->comment('変更後の怖さ評価値（0-4）');
            $table->timestamp('created_at')->comment('変更日時');

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('game_title_id')->references('id')->on('game_titles')->onDelete('cascade');
            $table->index('user_id');
            $table->index('game_title_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_game_title_fear_meter_logs');
    }
};

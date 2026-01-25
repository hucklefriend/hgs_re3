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
        Schema::create('game_title_fear_meter_statistics', function (Blueprint $table) {
            $table->unsignedInteger('game_title_id')->primary()->comment('ゲームタイトルID');
            $table->decimal('average_rating', 3, 2)->default(0.00)->comment('平均評価（0.00-4.00）');
            $table->unsignedInteger('total_count')->default(0)->comment('評価総数');
            $table->unsignedInteger('rating_0_count')->default(0)->comment('評価0の数');
            $table->unsignedInteger('rating_1_count')->default(0)->comment('評価1の数');
            $table->unsignedInteger('rating_2_count')->default(0)->comment('評価2の数');
            $table->unsignedInteger('rating_3_count')->default(0)->comment('評価3の数');
            $table->unsignedInteger('rating_4_count')->default(0)->comment('評価4の数');
            $table->timestamp('updated_at')->nullable()->comment('最終更新日時');

            $table->foreign('game_title_id')->references('id')->on('game_titles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_title_fear_meter_statistics');
    }
};

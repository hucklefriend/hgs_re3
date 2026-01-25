<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('game_title_fear_meter_statistics', function (Blueprint $table) {
            $table->unsignedTinyInteger('fear_meter')->nullable()->default(0)->after('average_rating')->comment('怖さ評価値（0-4、小数点以下切り捨て）');
        });

        // 既存データのfear_meterを設定（average_ratingから小数点以下を切り捨て）
        DB::statement('UPDATE game_title_fear_meter_statistics SET fear_meter = FLOOR(COALESCE(average_rating, 0)) WHERE fear_meter IS NULL');
        
        // NOT NULLに変更
        Schema::table('game_title_fear_meter_statistics', function (Blueprint $table) {
            $table->unsignedTinyInteger('fear_meter')->nullable(false)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_title_fear_meter_statistics', function (Blueprint $table) {
            $table->dropColumn('fear_meter');
        });
    }
};

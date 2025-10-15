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
        Schema::table('game_makers', function (Blueprint $table) {
            // phoneticカラムを追加 (node_nameの後に配置)
            $table->string('phonetic', 200)->nullable()->after('node_name')->comment('よみがな');
            
            // ratingカラムを追加 (phoneticの後に配置)
            $table->tinyInteger('rating')->unsigned()->default(0)->after('phonetic')->comment('レーティング');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_makers', function (Blueprint $table) {
            // ratingカラムを削除
            $table->dropColumn('rating');
            
            // phoneticカラムを削除
            $table->dropColumn('phonetic');
        });
    }
};

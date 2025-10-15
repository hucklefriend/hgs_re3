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
        Schema::table('game_franchises', function (Blueprint $table) {
            // h1_node_nameカラムを削除
            $table->dropColumn('h1_node_name');
            
            // ratingカラムを追加 (node_nameの後に配置)
            $table->tinyInteger('rating')->unsigned()->default(0)->after('node_name')->comment('レーティング');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_franchises', function (Blueprint $table) {
            // ratingカラムを削除
            $table->dropColumn('rating');
            
            // h1_node_nameカラムを復元
            $table->string('h1_node_name', 200)->after('node_name')->comment('タイトルノード表示用名称');
        });
    }
};

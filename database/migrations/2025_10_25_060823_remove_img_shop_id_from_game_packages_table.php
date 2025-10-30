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
        Schema::table('game_packages', function (Blueprint $table) {
            $table->dropColumn('img_shop_id');
        });

        Schema::table('game_package_shops', function (Blueprint $table) {
            // UNIQUEインデックスを削除
            $table->dropUnique('game_package_id');
            // 通常のINDEXとして再作成（重複可）
            $table->index(['game_package_id', 'shop_id'], 'game_package_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_package_shops', function (Blueprint $table) {
            // 通常のINDEXを削除
            $table->dropIndex('game_package_id');
            // UNIQUEインデックスとして再作成
            $table->unique(['game_package_id', 'shop_id'], 'game_package_id');
        });

        Schema::table('game_packages', function (Blueprint $table) {
            $table->unsignedInteger('img_shop_id')->nullable()->after('release_at');
        });
    }
};

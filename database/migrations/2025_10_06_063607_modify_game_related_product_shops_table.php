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
        Schema::table('game_related_product_shops', function (Blueprint $table) {
            // UNIQUEインデックス「shop」を削除
            $table->dropUnique('shop');
            
            // subtitleカラムをshop_idの後に追加
            $table->string('subtitle', 50)->nullable()->after('shop_id')->comment('サブタイトル');
            
            // 新しいKEYインデックス「shop」を作成
            $table->index(['game_related_product_id', 'shop_id'], 'shop');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_related_product_shops', function (Blueprint $table) {
            // KEYインデックス「shop」を削除
            $table->dropIndex('shop');
            
            // subtitleカラムを削除
            $table->dropColumn('subtitle');
            
            // 元のUNIQUEインデックス「shop」を復元
            $table->unique(['game_related_product_id', 'shop_id'], 'shop');
        });
    }
};

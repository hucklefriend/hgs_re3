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
        // 一時的な新しいカラムを追加
        Schema::table('contacts', function (Blueprint $table) {
            $table->tinyInteger('category_int')->nullable()->after('category');
        });

        // 既存データを変換
        DB::table('contacts')->where('category', '不具合報告')->update(['category_int' => 0]);
        DB::table('contacts')->where('category', 'ゲーム情報の誤り')->update(['category_int' => 1]);
        DB::table('contacts')->where('category', '機能要望')->update(['category_int' => 2]);
        DB::table('contacts')->where('category', 'その他')->update(['category_int' => 3]);

        // 古いカラムを削除
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        // 新しいカラムをcategoryにリネーム
        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('category_int', 'category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 一時的なカラムを追加
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('category_str')->nullable()->after('category');
        });

        // データを文字列に戻す
        DB::table('contacts')->where('category', 0)->update(['category_str' => '不具合報告']);
        DB::table('contacts')->where('category', 1)->update(['category_str' => 'ゲーム情報の誤り']);
        DB::table('contacts')->where('category', 2)->update(['category_str' => '機能要望']);
        DB::table('contacts')->where('category', 3)->update(['category_str' => 'その他']);

        // 古いカラムを削除
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('category');
        });

        // 新しいカラムをcategoryにリネーム
        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('category_str', 'category');
        });
    }
};

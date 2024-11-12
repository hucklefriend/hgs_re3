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
        Schema::table('game_titles', function (Blueprint $table): void {
            // カラム名を変更
            $table->renameColumn('adult_only_flag', 'rating');
        });

        Schema::table('game_titles', function (Blueprint $table) {
            $table->unsignedTinyInteger('rating')
                ->default(0)
                ->comment('レーティング')
                ->after('first_release_int')
                ->change();

            // インデックスを削除
            $table->dropIndex('game_softs_adult_only_flag_index');

            // 新しいインデックスを追加
            $table->index('rating', 'game_softs_rating_index', 'BTREE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_titles', function (Blueprint $table) {
            // 新しいインデックスを削除
            $table->dropIndex('game_softs_rating_index');

            // インデックスを削除後、型を戻す
            $table->boolean('rating')
                ->default(0)
                ->comment('成人向けフラグ')
                ->change();

            // カラム名を元に戻す
            $table->renameColumn('rating', 'adult_only_flag');

            // 元のインデックスを再追加
            $table->index('adult_only_flag', 'game_softs_adult_only_flag_index');
        });
    }
};

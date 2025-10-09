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
        Schema::dropIfExists('game_main_network_franchises');
        Schema::dropIfExists('game_main_network_params');
    }

    /**
     * Rollback the migrations.
     */
    public function down(): void
    {
        // Note: ロールバック時のテーブル再作成は、元のテーブル構造が
        // 不明なため実装していません。必要に応じて追加してください。
    }
};


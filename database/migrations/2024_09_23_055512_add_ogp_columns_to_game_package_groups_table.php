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
        Schema::table('game_package_groups', function (Blueprint $table) {
            $table->text('simple_shop_text')->nullable()->after('description_source')->comment('簡易ショップ表示');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_package_groups', function (Blueprint $table) {
            $table->dropColumn(['simple_shop_text']);
        });
    }
};

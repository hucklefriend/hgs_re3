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
            $table->unsignedBigInteger('ogp_cache_id')->nullable()->after('img_tag')->comment('OGPキャッシュID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_related_product_shops', function (Blueprint $table) {
            $table->dropColumn(['ogp_cache_id']);
        });
    }
};

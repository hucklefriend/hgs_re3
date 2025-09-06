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
        Schema::table('ogp_caches', function (Blueprint $table) {
            $table->integer('image_width')->nullable()->after('image')->comment('画像の幅');
            $table->integer('image_height')->nullable()->after('image_width')->comment('画像の高さ');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ogp_caches', function (Blueprint $table) {
            $table->dropColumn(['image_width', 'image_height']);
        });
    }
};

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddOgpColumnsToGameTitlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('game_titles', function (Blueprint $table): void {
            $table->unsignedBigInteger('ogp_cache_id')->nullable()->after('description_source')->comment('OGPキャッシュID');
            $table->unsignedTinyInteger('use_ogp_description')->default(0)->after('ogp_cache_id')->comment('OGPの紹介文をあらすじに流用するフラグ');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('game_titles', function (Blueprint $table): void {
            $table->dropColumn(['ogp_cache_id', 'use_ogp_description']);
        });
    }
}

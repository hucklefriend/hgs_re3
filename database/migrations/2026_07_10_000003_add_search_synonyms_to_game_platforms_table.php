<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('game_platforms', function (Blueprint $table) {
            $table->text('search_synonyms')->nullable()->after('description_source')->comment('検索用俗称（改行区切り）');
        });

        DB::table('game_platform_synonyms')
            ->select('game_platform_id', 'synonym')
            ->orderBy('game_platform_id')
            ->orderBy('id')
            ->get()
            ->groupBy('game_platform_id')
            ->each(function ($rows, $platformId) {
                DB::table('game_platforms')
                    ->where('id', $platformId)
                    ->update(['search_synonyms' => $rows->pluck('synonym')->implode("\r\n")]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_platforms', function (Blueprint $table) {
            $table->dropColumn('search_synonyms');
        });
    }
};

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
        Schema::table('game_makers', function (Blueprint $table) {
            $table->text('search_synonyms')->nullable()->after('description_source')->comment('検索用俗称（改行区切り）');
        });

        DB::table('game_maker_synonyms')
            ->select('game_maker_id', 'synonym')
            ->orderBy('game_maker_id')
            ->orderBy('created_at')
            ->get()
            ->groupBy('game_maker_id')
            ->each(function ($rows, $makerId) {
                DB::table('game_makers')
                    ->where('id', $makerId)
                    ->update(['search_synonyms' => $rows->pluck('synonym')->implode("\r\n")]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_makers', function (Blueprint $table) {
            $table->dropColumn('search_synonyms');
        });
    }
};

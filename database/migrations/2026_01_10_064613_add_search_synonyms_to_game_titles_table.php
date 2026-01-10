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
        Schema::table('game_titles', function (Blueprint $table) {
            $table->text('search_synonyms')->nullable()->after('issue')->comment('検索用俗称（改行区切り）');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_titles', function (Blueprint $table) {
            $table->dropColumn('search_synonyms');
        });
    }
};

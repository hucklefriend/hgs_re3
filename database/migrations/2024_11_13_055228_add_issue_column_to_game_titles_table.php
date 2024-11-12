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
            $table->text('issue')
                ->nullable()
                ->default(null)
                ->comment('ホラーゲームかどうかの疑義')
                ->after('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_titles', function (Blueprint $table) {
            $table->dropColumn('issue');
        });
    }
};

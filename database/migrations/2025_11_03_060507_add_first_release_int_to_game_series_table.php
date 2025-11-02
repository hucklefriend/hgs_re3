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
        Schema::table('game_series', function (Blueprint $table) {
            $table->unsignedInteger('first_release_int')->default(0)->after('node_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('game_series', function (Blueprint $table) {
            $table->dropColumn('first_release_int');
        });
    }
};

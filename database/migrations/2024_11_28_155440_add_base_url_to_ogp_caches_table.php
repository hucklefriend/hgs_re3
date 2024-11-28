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
            $table->text('base_url')
                ->after('hash')
                ->comment('入力元URL')
                ->collation('utf8mb4_unicode_ci');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ogp_caches', function (Blueprint $table) {
            $table->dropColumn('base_url');
        });
    }
};

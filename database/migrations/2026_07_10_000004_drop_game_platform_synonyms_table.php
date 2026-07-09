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
        Schema::dropIfExists('game_platform_synonyms');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('game_platform_synonyms', function (Blueprint $table) {
            $table->id()->comment('id');
            $table->unsignedBigInteger('game_platform_id')->comment('プラットフォームID');
            $table->string('synonym', 100)->default('')->comment('俗称');
            $table->timestamps();
            $table->index('synonym');
        });
    }
};

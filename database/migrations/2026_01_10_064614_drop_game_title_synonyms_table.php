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
        Schema::dropIfExists('game_title_synonyms');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('game_title_synonyms', function (Blueprint $table) {
            $table->id()->comment('id');
            $table->unsignedBigInteger('game_title_id')->comment('ゲームタイトルID');
            $table->string('synonym', 100)->default('')->comment('俗称');
            $table->timestamps();
            $table->index('synonym');
        });
    }
};

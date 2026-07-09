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
        Schema::dropIfExists('game_maker_synonyms');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('game_maker_synonyms', function (Blueprint $table) {
            $table->unsignedBigInteger('game_maker_id')->comment('メーカーID');
            $table->string('synonym', 100)->default('')->comment('俗称');
            $table->timestamps();
            $table->index('synonym');
            $table->index('game_maker_id');
        });
    }
};

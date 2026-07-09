<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('game_title_fear_meter_statistics', 'title_fear_meter_statistics');
        Schema::rename('game_title_review_statistics', 'title_review_statistics');
    }

    public function down(): void
    {
        Schema::rename('title_fear_meter_statistics', 'game_title_fear_meter_statistics');
        Schema::rename('title_review_statistics', 'game_title_review_statistics');
    }
};

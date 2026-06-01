<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rss_article_matched_franchises', function (Blueprint $table) {
            $table->unsignedBigInteger('rss_article_id');
            $table->unsignedInteger('game_franchise_id'); // game_franchises.id は int unsigned

            $table->primary(['rss_article_id', 'game_franchise_id']);
            $table->index('game_franchise_id', 'rssamf_franchise_idx');

            $table->foreign('rss_article_id', 'rssamf_article_fk')
                ->references('id')
                ->on('rss_articles')
                ->cascadeOnDelete();
            $table->foreign('game_franchise_id', 'rssamf_franchise_fk')
                ->references('id')
                ->on('game_franchises')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rss_article_matched_franchises');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('rss_article_matched_titles');
    }

    public function down(): void
    {
        Schema::create('rss_article_matched_titles', function ($table) {
            $table->unsignedBigInteger('rss_article_id');
            $table->unsignedInteger('game_title_id');

            $table->primary(['rss_article_id', 'game_title_id']);
            $table->index('game_title_id', 'rssamt_title_idx');

            $table->foreign('rss_article_id', 'rssamt_article_fk')
                ->references('id')
                ->on('rss_articles')
                ->cascadeOnDelete();
            $table->foreign('game_title_id', 'rssamt_title_fk')
                ->references('id')
                ->on('game_titles')
                ->cascadeOnDelete();
        });
    }
};

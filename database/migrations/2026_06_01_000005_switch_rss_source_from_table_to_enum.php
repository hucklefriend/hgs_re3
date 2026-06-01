<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('rss_article_matched_franchises');
        Schema::dropIfExists('rss_article_matched_titles');
        Schema::dropIfExists('rss_articles');
        Schema::dropIfExists('rss_sources');

        Schema::create('rss_articles', function (Blueprint $table) {
            $table->id();
            $table->string('rss_source', 32)->comment('RSSソース（RssSource Enumの値）');
            $table->string('guid', 2048)->comment('RSSのguid or link（重複判定キー）');
            $table->string('guid_hash', 64)->comment('(rss_source, guid)のSHA256ハッシュ');
            $table->string('url', 2048)->comment('記事URL');
            $table->string('url_hash', 64)->comment('urlのSHA256ハッシュ（OgpCache紐付け用）');
            $table->boolean('has_horror_keyword')->default(false)->comment('「ホラーゲーム」を含むか');
            $table->timestamp('published_at')->nullable()->comment('RSS配信日時');
            $table->timestamp('created_at')->nullable();

            $table->unique(['rss_source', 'guid_hash'], 'rssart_source_guid_unique');
            $table->index('published_at', 'rssart_published_idx');
            $table->index('rss_source', 'rssart_source_idx');
        });

        Schema::create('rss_article_matched_titles', function (Blueprint $table) {
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

        Schema::create('rss_article_matched_franchises', function (Blueprint $table) {
            $table->unsignedBigInteger('rss_article_id');
            $table->unsignedInteger('game_franchise_id');

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
        Schema::dropIfExists('rss_article_matched_titles');
        Schema::dropIfExists('rss_articles');
    }
};

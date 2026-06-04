<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rss_articles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rss_source_id')->comment('RSS配信元ID');
            $table->string('guid', 2048)->comment('RSSのguid or link（重複判定キー）');
            // guid は長すぎてUNIQUEインデックスを直接貼れないため SHA256ハッシュで代替
            $table->string('guid_hash', 64)->comment('(rss_source_id, guid)のSHA256ハッシュ');
            $table->string('url', 2048)->comment('記事URL');
            // OgpCache.hash と突き合わせるためのURLのSHA256ハッシュ
            $table->string('url_hash', 64)->comment('urlのSHA256ハッシュ（OgpCache紐付け用）');
            $table->boolean('has_horror_keyword')->default(false)->comment('「ホラーゲーム」を含むか');
            $table->timestamp('published_at')->nullable()->comment('RSS配信日時');
            $table->timestamp('created_at')->nullable();

            $table->unique(['rss_source_id', 'guid_hash'], 'rssart_source_guid_unique');
            $table->index('published_at', 'rssart_published_idx');
            $table->index('rss_source_id', 'rssart_source_idx');

            $table->foreign('rss_source_id', 'rssart_source_fk')
                ->references('id')
                ->on('rss_sources')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rss_articles');
    }
};

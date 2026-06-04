<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rss_fetch_logs', function (Blueprint $table) {
            $table->id();
            $table->string('rss_source', 32)->nullable()->comment('取得ソース（NULL=全ソース）');
            $table->string('status', 16)->default('running')->comment('running / success / error');
            $table->unsignedInteger('new_article_count')->default(0)->comment('新着記事数');
            $table->text('error_message')->nullable()->comment('エラー内容');
            $table->timestamp('started_at')->comment('取得開始日時');
            $table->timestamp('finished_at')->nullable()->comment('取得完了日時');

            $table->index('started_at');
            $table->index('rss_source');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rss_fetch_logs');
    }
};

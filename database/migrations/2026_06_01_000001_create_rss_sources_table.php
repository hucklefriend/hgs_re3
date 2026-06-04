<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rss_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->comment('サイト名');
            $table->string('url', 2048)->comment('RSSフィードURL');
            $table->boolean('is_active')->default(true)->comment('取得有効フラグ');
            $table->timestamp('last_fetched_at')->nullable()->comment('最終取得日時');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rss_sources');
    }
};

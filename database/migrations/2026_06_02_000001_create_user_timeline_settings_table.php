<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_timeline_settings', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->primary()->comment('ユーザーID');
            $table->boolean('show_horror_keyword_rss')->default(true)->comment('「ホラーゲーム」キーワードでマッチしたRSS記事を表示するか');
            $table->boolean('show_favorite_franchise_rss')->default(true)->comment('お気に入りタイトル（フランチャイズ）にマッチしたRSS記事を表示するか');
            $table->boolean('show_followed_user_activity')->default(true)->comment('フォロー中ユーザーの活動（レビュー・怖さメーター）を表示するか');
            $table->boolean('publish_activity_to_root')->default(true)->comment('自分のレビュー・怖さメーター更新をルートタイムラインに掲載するか');
            $table->timestamps();

            $table->foreign('user_id', 'utls_user_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_timeline_settings');
    }
};

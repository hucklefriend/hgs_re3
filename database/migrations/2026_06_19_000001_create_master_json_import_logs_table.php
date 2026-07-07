<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('master_json_import_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_user_id')->comment('実行した管理者のユーザーID');
            $table->string('target_type', 30)->comment('対象種別（title/media_mix）');
            $table->unsignedInteger('target_id')->comment('対象ID');
            $table->longText('before_json')->comment('適用前のシリアライズJSON');
            $table->longText('imported_json')->comment('貼り付けられたJSON');
            $table->longText('applied_diff_json')->comment('実際に採用された差分');
            $table->timestamps();

            $table->index(['target_type', 'target_id']);
            $table->foreign('admin_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('master_json_import_logs');
    }
};

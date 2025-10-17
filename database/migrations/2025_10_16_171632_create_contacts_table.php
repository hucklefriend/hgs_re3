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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subject')->nullable();
            $table->string('category')->nullable();
            $table->text('message');
            $table->tinyInteger('status')->default(0)->comment('0:未対応, 1:対応中, 2:完了, 3:クローズ');
            $table->text('admin_notes')->nullable()->comment('管理者メモ');
            $table->string('ip_address', 45)->nullable()->comment('送信元IPアドレス');
            $table->text('user_agent')->nullable()->comment('ユーザーエージェント');
            $table->unsignedBigInteger('user_id')->nullable()->comment('ログインユーザーID');
            $table->string('token')->unique()->comment('問い合わせ識別トークン');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};

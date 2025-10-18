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
        Schema::create('contact_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contact_id')->comment('問い合わせID');
            $table->text('message')->comment('返信内容');
            $table->tinyInteger('responder_type')->comment('0:管理者, 1:ユーザー, 2:システム');
            $table->unsignedBigInteger('user_id')->nullable()->comment('返信した管理者のユーザーID');
            $table->string('responder_name')->nullable()->comment('返信者名');
            $table->string('ip_address', 45)->nullable()->comment('送信元IPアドレス');
            $table->text('user_agent')->nullable()->comment('ユーザーエージェント');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_responses');
    }
};

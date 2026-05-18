<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timeline_events', function (Blueprint $table) {
            $table->id()->comment('ID');
            $table->string('event_type', 32)->comment('イベント種別（TimelineEventType）');
            $table->string('actor_type', 16)->nullable()->comment('アクター種別（TimelineActorType）');
            $table->unsignedBigInteger('actor_id')->nullable()->comment('アクターID（actor_type=user のとき users.id）');
            $table->string('subject_type', 32)->comment('サブジェクト種別（TimelineSubjectType）');
            $table->unsignedBigInteger('subject_id')->comment('サブジェクトID（subject_type に対応するID）');
            $table->unsignedBigInteger('recipient_user_id')->nullable()->comment('通知先ユーザーID（通知系イベント共通）');
            $table->json('payload')->nullable()->comment('付随情報（怖さメーターラベルなど）');
            $table->timestamp('created_at')->comment('イベント発生日時');

            $table->index(['actor_type', 'actor_id', 'created_at'], 'tlevt_actor_idx');
            $table->index(['subject_type', 'subject_id', 'created_at'], 'tlevt_subject_idx');
            $table->index(['recipient_user_id', 'created_at'], 'tlevt_recipient_idx');

            $table->foreign('actor_id', 'tlevt_actor_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
            $table->foreign('recipient_user_id', 'tlevt_recipient_fk')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timeline_events');
    }
};

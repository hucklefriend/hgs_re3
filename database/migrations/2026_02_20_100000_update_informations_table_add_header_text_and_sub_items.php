<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * body を header_text にリネーム（null可）、サブタイトル・サブテキスト1〜10を追加
     */
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        $tableName = 'information';

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE {$tableName} CHANGE body header_text TEXT NULL");
        } else {
            Schema::table($tableName, function (Blueprint $table) {
                $table->renameColumn('body', 'header_text');
            });
            Schema::table($tableName, function (Blueprint $table) {
                $table->text('header_text')->nullable()->change();
            });
        }

        Schema::table($tableName, function (Blueprint $table) {
            $table->string('sub_title_1', 255)->nullable()->after('header_text');
            $table->text('sub_text_1')->nullable()->after('sub_title_1');
            $table->string('sub_title_2', 255)->nullable()->after('sub_text_1');
            $table->text('sub_text_2')->nullable()->after('sub_title_2');
            $table->string('sub_title_3', 255)->nullable()->after('sub_text_2');
            $table->text('sub_text_3')->nullable()->after('sub_title_3');
            $table->string('sub_title_4', 255)->nullable()->after('sub_text_3');
            $table->text('sub_text_4')->nullable()->after('sub_title_4');
            $table->string('sub_title_5', 255)->nullable()->after('sub_text_4');
            $table->text('sub_text_5')->nullable()->after('sub_title_5');
            $table->string('sub_title_6', 255)->nullable()->after('sub_text_5');
            $table->text('sub_text_6')->nullable()->after('sub_title_6');
            $table->string('sub_title_7', 255)->nullable()->after('sub_text_6');
            $table->text('sub_text_7')->nullable()->after('sub_title_7');
            $table->string('sub_title_8', 255)->nullable()->after('sub_text_7');
            $table->text('sub_text_8')->nullable()->after('sub_title_8');
            $table->string('sub_title_9', 255)->nullable()->after('sub_text_8');
            $table->text('sub_text_9')->nullable()->after('sub_title_9');
            $table->string('sub_title_10', 255)->nullable()->after('sub_text_9');
            $table->text('sub_text_10')->nullable()->after('sub_title_10');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = 'information';
        $driver = Schema::getConnection()->getDriverName();

        Schema::table($tableName, function (Blueprint $table) {
            $table->dropColumn([
                'sub_title_1', 'sub_text_1', 'sub_title_2', 'sub_text_2',
                'sub_title_3', 'sub_text_3', 'sub_title_4', 'sub_text_4',
                'sub_title_5', 'sub_text_5', 'sub_title_6', 'sub_text_6',
                'sub_title_7', 'sub_text_7', 'sub_title_8', 'sub_text_8',
                'sub_title_9', 'sub_text_9', 'sub_title_10', 'sub_text_10',
            ]);
        });

        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement("ALTER TABLE {$tableName} CHANGE header_text body TEXT NOT NULL");
        } else {
            Schema::table($tableName, function (Blueprint $table) {
                $table->text('header_text')->nullable(false)->change();
            });
            Schema::table($tableName, function (Blueprint $table) {
                $table->renameColumn('header_text', 'body');
            });
        }
    }
};

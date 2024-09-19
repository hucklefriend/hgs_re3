<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOgpCachesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('ogp_caches', function (Blueprint $table): void {
            $table->id();

            $table->char('hash', 64)
                ->collation('latin1_swedish_ci')
                ->comment('URLのハッシュ')
                ->charset('latin1')
                ->unique(); // ユニークキーとして設定

            $table->text('title')
                ->nullable()
                ->comment('サイト名');

            $table->text('description')
                ->nullable()
                ->comment('説明文');

            $table->text('url')
                ->nullable()
                ->comment('URL');

            $table->text('image')
                ->nullable()
                ->comment('画像URL');

            $table->text('type')
                ->nullable()
                ->comment('タイプ');

            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('ogp_caches');
    }
}

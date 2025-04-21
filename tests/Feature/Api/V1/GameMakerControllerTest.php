<?php

namespace Tests\Feature\Api\V1;

use App\Models\GameMaker;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class GameMakerControllerTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        // ミドルウェアの無効化を削除し、代わりにヘッダーを設定
        $this->withHeaders([
            'X-GPTS-API-KEY' => 'aaa'
        ]);
    }

    /**
     * ゲームメーカー一覧の取得テスト
     *
     * @return void
     */
    public function test_index(): void
    {
        // テストデータを3件作成
        $gameMakers = GameMaker::factory()->count(3)->create();

        // デバッグ用：現在のURLを出力
        $url = route('api.v1.game-makers.index');
        echo "\nアクセスURL: " . $url . "\n";

        // APIを呼び出し
        $response = $this->getJson($url);

        // デバッグ用：レスポンスの内容を出力
        echo "レスポンスステータス: " . $response->status() . "\n";
        echo "レスポンス内容: " . $response->content() . "\n";

        // ステータスコードの確認
        $response->assertStatus(200);

        // レスポンスの構造確認
        $response->assertJsonStructure([
            '*' => [
                'id',
                'key',
                'name',
                'node_name',
                'h1_node_name',
                'description',
                'description_source',
                'related_game_maker_id'
            ]
        ]);

        // レスポンスの件数確認
        $this->assertCount(3, $response->json());

        // レスポンスの内容確認
        foreach ($gameMakers as $gameMaker) {
            $response->assertJsonFragment([
                'id' => $gameMaker->id,
                'key' => $gameMaker->key,
                'name' => $gameMaker->name,
            ]);
        }
    }
} 
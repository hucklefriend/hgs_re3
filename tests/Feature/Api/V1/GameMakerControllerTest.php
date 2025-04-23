<?php

namespace Tests\Feature\Api\V1;

use App\Models\GameMaker;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;

class GameMakerControllerTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * テストのセットアップ
     * 
     * @return void
     */
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
        Log::info('アクセスURL: ' . $url);

        // APIを呼び出し
        $response = $this->getJson($url);

        // デバッグ用：レスポンスの内容を出力
        Log::info('レスポンスステータス: ' . $response->status());
        Log::info('レスポンス内容: ' . $response->content());

        $response->assertStatus(404);

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

    /**
     * ゲームメーカー登録のテスト
     *
     * @return void
     */
    public function test_store(): void
    {
        $data = [
            'key' => 'test-maker',
            'name' => 'テストメーカー',
            'node_name' => 'Test Maker',
            'h1_node_name' => 'Test Maker H1',
            'description' => 'テストメーカーの説明',
            'description_source' => 'テストソース',
            'related_game_maker_id' => null
        ];

        // APIを呼び出し
        $url = route('api.v1.game-makers.store');
        $response = $this->postJson($url, $data);

        // デバッグ用：レスポンスの内容を出力
        Log::info('レスポンスステータス: ' . $response->status());
        Log::info('レスポンス内容: ' . $response->content());

        // ステータスコードの確認
        $response->assertStatus(201);

        // レスポンスの構造確認
        $response->assertJsonStructure([
            'id',
            'key',
            'name',
            'node_name',
            'h1_node_name',
            'description',
            'description_source',
            'related_game_maker_id'
        ]);

        // データベースに登録されていることを確認
        $this->assertDatabaseHas('game_makers', [
            'key' => 'test-maker',
            'name' => 'テストメーカー',
            'node_name' => 'Test Maker',
            'h1_node_name' => 'Test Maker H1',
            'description' => 'テストメーカーの説明',
            'description_source' => 'テストソース'
        ]);

        // レスポンスの内容確認
        $response->assertJson([
            'key' => 'test-maker',
            'name' => 'テストメーカー',
            'node_name' => 'Test Maker',
            'h1_node_name' => 'Test Maker H1',
            'description' => 'テストメーカーの説明',
            'description_source' => 'テストソース'
        ]);
    }

    /**
     * バリデーションエラーのテスト
     *
     * @return void
     */
    public function test_store_validation(): void
    {
        // 必須項目が欠けているデータ
        $data = [
            'description' => 'テストメーカーの説明',
            'description_source' => 'テストソース'
        ];

        // APIを呼び出し
        $url = route('api.v1.game-makers.store');
        $response = $this->postJson($url, $data);

        // デバッグ用：レスポンスの内容を出力
        Log::info('レスポンスステータス: ' . $response->status());
        Log::info('レスポンス内容: ' . $response->content());

        // ステータスコードの確認（バリデーションエラー）
        $response->assertStatus(422);

        // バリデーションエラーメッセージの確認
        $response->assertJsonValidationErrors(['key', 'name', 'node_name', 'h1_node_name']);
    }

    /**
     * keyの一意性チェックのテスト
     *
     * @return void
     */
    public function test_store_unique_key(): void
    {
        // 既存のデータを作成
        GameMaker::factory()->create([
            'key' => 'existing-key'
        ]);

        // 同じkeyで新規登録を試みる
        $data = [
            'key' => 'existing-key',
            'name' => 'テストメーカー',
            'node_name' => 'Test Maker',
            'h1_node_name' => 'Test Maker H1'
        ];

        // APIを呼び出し
        $url = route('api.v1.game-makers.store');
        $response = $this->postJson($url, $data);

        // デバッグ用：レスポンスの内容を出力
        Log::info('レスポンスステータス: ' . $response->status());
        Log::info('レスポンス内容: ' . $response->content());

        // ステータスコードの確認（バリデーションエラー）
        $response->assertStatus(422);

        // keyの一意性エラーメッセージの確認
        $response->assertJsonValidationErrors(['key']);
    }
} 
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

// テスト用ルート（開発環境のみ）
if (app()->environment('local')) {
    
    // Laravel Debugbarのテスト用ルート
    Route::get('/test/debugbar', function () {
        // ログメッセージを出力
        Log::info('Debugbarテスト: 情報ログ');
        Log::warning('Debugbarテスト: 警告ログ');
        Log::error('Debugbarテスト: エラーログ');
        
        // データベースクエリを実行（デバッグバーで確認可能）
        $users = \App\Models\User::take(5)->get();
        
        // メール送信のテスト（デバッグバーで確認可能）
        \Illuminate\Support\Facades\Mail::raw('テストメール', function ($message) {
            $message->to('test@example.com')->subject('Debugbarテストメール');
        });
        
        return response()->json([
            'message' => 'Laravel Debugbarのテストが完了しました。',
            'users_count' => $users->count(),
            'note' => 'ブラウザの下部にデバッグバーが表示されているはずです。'
        ]);
    });
    
    // エラーのテスト用ルート
    Route::get('/test/error', function () {
        try {
            // 意図的にエラーを発生させる
            $undefinedVariable = $nonExistentVariable;
        } catch (Error $e) {
            Log::error('テストエラーが発生しました', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
        
        return response()->json(['message' => 'エラーテストが完了しました。デバッグバーでエラーを確認してください。']);
    });
}

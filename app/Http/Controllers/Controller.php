<?php

namespace App\Http\Controllers;

use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Throwable;

abstract class Controller
{
    protected bool $isOver18 = false;

    public function __construct()
    {
        if (App::environment('local')) {
            Auth::guard('admin')->attempt(['email' => 'webmaster@horragame.net', 'password' => 'huckle'], true);
        }

        // 現在のURLにクエリ文字列でover18=1があったら、cookieにover18=1をセットする
        if (request()->query('over18', 0) == 1) {
            Cookie::queue('is_over_18', 1, 60 * 60 * 24 * 30);
            $this->isOver18 = true;
        } else {
            // cookieからis_over_18を取得
            $this->isOver18 = intval(Cookie::get('is_over_18', 0)) === 1;
        }
    }
    
    /**
     * Ajaxリクエストかどうかを判定する
     *
     * @return bool
     */
    private static function isAjax(): bool
    {
        return request()->ajax() || (request()->query('a', 0) == 1);
    }

    /**
     * ツリーの生成
     *
     * @param View $view
     * @param bool $ratingCheck
     * @param string $url
     * @return JsonResponse|View
     * @throws \Throwable
     */
    protected function tree(View $view, bool $ratingCheck = false, string $url = ''): JsonResponse|View
    {
        $view->with('isOver18', $this->isOver18);

        if ($ratingCheck) {
            if (!$this->isOver18) {
                $view = $this->ratingCheck(request()->fullUrl());
            }
        }

        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにテキストを返す
        if (self::isAjax()) {
            $rendered = $view->renderSections();
            return response()->json([
                'title'              => $rendered['title'],
                'currentNodeTitle'   => $rendered['current-node-title'],
                'currentNodeContent' => $rendered['current-node-content'] ?? '',
                'nodes'              => $rendered['nodes'],
                'popup'              => $rendered['popup'] ?? '',
                'url'                => $url,
                'hasError'           => false,
            ]);
        }

        return $view->with('viewerType', 'tree');
    }

    private function ratingCheck(string $currentUrl): View
    {
        // URLを分解
        $parsedUrl = parse_url($currentUrl);
        
        // クエリパラメータを配列に変換
        $queryParams = [];
        if (isset($parsedUrl['query'])) {
            parse_str($parsedUrl['query'], $queryParams);
        }
        
        // a パラメータを除外し、over18=1 を追加
        unset($queryParams['a']);
        $queryParams['over18'] = 1;
        
        // URLを再構築
        $scheme = $parsedUrl['scheme'] ?? 'http';
        $host = $parsedUrl['host'] ?? '';
        $port = isset($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '';
        $path = $parsedUrl['path'] ?? '';
        $query = http_build_query($queryParams);
        
        $currentUrl = "{$scheme}://{$host}{$port}{$path}?{$query}";

        return view('rating_check', compact('currentUrl'));
    }

    /**
     * グローバル例外処理（staticメソッド）
     *
     * @param Throwable $e
     * @param Request $request
     * @return JsonResponse|View
     */
    public static function handleGlobalException(Throwable $e, Request $request): JsonResponse|View
    {
        // ログに記録
        Log::error('Exception occurred', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
            'url' => $request->fullUrl(),
            'user_agent' => $request->userAgent(),
        ]);

        // デバッグモードの場合は詳細なエラー情報を表示
        if (config('app.debug')) {
            $errorMessage = $e->getMessage();
            $errorFile = $e->getFile();
            $errorLine = $e->getLine();
            $errorTrace = $e->getTraceAsString();
        } else {
            $errorMessage = 'システムエラーが発生しました。';
            $errorFile = '';
            $errorLine = '';
            $errorTrace = '';
        }

        // Ajaxリクエストかどうかを判定
        $isAjax = $request->ajax() || ($request->query('a', 0) == 1);

        /** @var View $view */
        $view = view('errors.500', compact('errorMessage', 'errorFile', 'errorLine', 'errorTrace'))
            ->with('hasError', true);

        // Ajaxリクエストの場合はJSONで返す
        if ($isAjax) {
            $rendered = $view->renderSections();
            return response()->json([
                'title'              => $rendered['title'],
                'currentNodeTitle'   => $rendered['current-node-title'],
                'currentNodeContent' => $rendered['current-node-content'] ?? '',
                'nodes'              => $rendered['nodes'],
                'popup'              => $rendered['popup'] ?? '',
                'url'                => '',
                'hasError'           => true,
            ]);
        }

        // 通常のリクエストの場合はエラーページを表示
        return $view;
    }
}

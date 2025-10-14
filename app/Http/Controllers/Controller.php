<?php

namespace App\Http\Controllers;

use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

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
     * @param array $components
     * @return JsonResponse|View
     * @throws \Throwable
     */
    protected function tree(View $view, bool $ratingCheck = false, array $components = []): JsonResponse|View
    {
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
                'components'         => $components,
            ]);
        }

        return $view->with('viewerType', 'tree')
            ->with('components', $components);
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
}

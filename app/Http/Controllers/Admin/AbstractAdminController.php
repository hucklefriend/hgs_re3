<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

abstract class AbstractAdminController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * 検索内容とページ番号をクエリ文字列化してセッションに保持
     *
     * @param array $search
     * @return void
     */
    protected function saveSearchSession(array $search): void
    {
        $page = request()->query('page');
        if ($page !== null) {
            $search['page'] = intval($page);
        }

        $key = $this->makeSearchSessionKey();
        \Log::debug($key);
        if (!empty($search)) {
            session([$key => $search]);
        } else {
            session([$key => []]);
        }
    }

    /**
     * 検索内容を取得
     *
     * @return array
     */
    protected function getSearchSession(): array
    {
        return session($this->makeSearchSessionKey(), []);
    }

    /**
     * 検索セッションのキーを生成
     *
     * @return string
     */
    protected function makeSearchSessionKey(): string
    {
        return 'search_' . substr(class_basename($this), 4, -10);
    }

    /**
     * パンくずリストを上書き
     *
     * @param array $overwriteBreadcrumb
     * @return void
     */
    protected function overwriteBreadcrumb(array $overwriteBreadcrumb): void
    {
        \Illuminate\Support\Facades\View::share('overwriteBreadcrumb', $overwriteBreadcrumb);
    }
}

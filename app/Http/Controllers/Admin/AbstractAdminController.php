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
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    protected function getSearchSession(): array
    {
        return session()->get($this->makeSearchSessionKey(), []);
    }

    /**
     * 検索セッションのキーを生成
     *
     * @return void
     */
    protected function makeSearchSessionKey(): string
    {
        // "search_コントローラー名"
        return 'search_' . class_basename($this);
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

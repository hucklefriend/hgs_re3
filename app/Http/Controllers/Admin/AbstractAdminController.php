<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class AbstractAdminController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * 検索内容とページ番号をクエリ文字列化してセッションに保持
     *
     * @param string $key
     * @param array $search
     * @return void
     */
    protected function saveSearchSession(string $key, array $search): void
    {
        $page = request()->query('page');
        if ($page !== null) {
            $search['page'] = intval($page);
        }

        if (!empty($search)) {
            session([$key => '?' . http_build_query($search)]);
        } else {
            session([$key => '']);
        }
    }
}

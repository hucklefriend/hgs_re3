<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    private static function isAjax(): bool
    {
        return request()->ajax() || (request()->query('a', 0) == 1);
    }

    protected function network(Factory|View $view): JsonResponse|Application|Factory|View
    {
        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにテキストを返す
        if (self::isAjax()) {
            $rendered = $view->renderSections();
            return response()->json([
                'network' => $rendered['content'],
                'popup'   => $rendered['popup'] ?? '',
            ]);
        }

        return $view;
    }

    protected function contentNode(Factory|View $view)
    {
        if (self::isAjax()) {
            $rendered = $view->renderSections();
            return response()->json([
                'title'  => $rendered['content-node-title'],
                'body'   => $rendered['content-node-body'],
                'footer' => $rendered['content-node-footer'] ?? '',
            ]);
        }

        return $view;
    }
}

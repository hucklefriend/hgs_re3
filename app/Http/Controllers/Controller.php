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

    protected function network(Factory|View $view): JsonResponse|Application|Factory|View
    {
        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにテキストを返す
        if (request()->ajax()) {
            $rendered = $view->renderSections();
            return response()->json([
                'network' => $rendered['content'],
            ]);
        }

        return $view;
    }

    protected function contentNode(Factory|View $view)
    {
        if (request()->ajax()) {
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

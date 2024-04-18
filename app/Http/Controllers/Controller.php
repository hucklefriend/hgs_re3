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

    protected function network(string $view, array $data = [], array $mergeData = []): JsonResponse|Application|Factory|View
    {
        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにテキストを返す
        if (request()->ajax()) {
            $rendered = \Illuminate\Support\Facades\View::make($view, $data, $mergeData)->renderSections();
            return response()->json([
                'network' => $rendered['content'],
            ]);
        }

        return view($view, $data, $mergeData);
    }

    protected function contentNode(string $view, array $data = [], array $mergeData = [])
    {
        if (request()->ajax()) {
            $rendered = \Illuminate\Support\Facades\View::make($view, $data, $mergeData)->renderSections();
            return response()->json([
                'title'  => $rendered['content-node-title'],
                'body'   => $rendered['content-node-body'],
                'footer' => $rendered['content-node-footer'] ?? '',
            ]);
        }

        return view($view, $data, $mergeData);
    }
}

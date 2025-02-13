<?php

namespace App\Http\Controllers;

use App\Models\Information;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;

abstract class Controller
{
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
     * マップ表示
     *
     * @param Factory|View $view
     * @param string $json
     * @return JsonResponse|Application|Factory|View
     */
    protected function map(Factory|View $view, string $json): JsonResponse|Application|Factory|View
    {
        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにJSONテキストを返す
        if (self::isAjax()) {
            return response($json, 200, [
                'Content-Type' => 'application/json'
            ]);
        }

        // $viewに$jsonを渡してviewを返す
        return $view->with('json', $json)
            ->with('viewerType', 'map');
    }

    /**
     * ネットワークの生成
     *
     * @param Factory|View $view
     * @param bool $ratingCheck
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    protected function document(Factory|View $view, bool $ratingCheck = false): JsonResponse|Application|Factory|View
    {
        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにテキストを返す
        if (self::isAjax()) {
            $rendered = $view->renderSections();
            return response()->json([
                'title'   => $rendered['title'],
                'network' => $rendered['content'],
                'popup'   => $rendered['popup'] ?? '',
                'ratingCheck' => $ratingCheck,
            ]);
        }

        return $view->with('viewerType', 'document');
    }

    /**
     * コンテンツノードの表示
     *
     * @param Factory|View $view
     * @param callable $baseViewCallback
     * @return Factory|View|JsonResponse
     * @throws \Throwable
     */
    protected function contentNode(Factory|View $view, $baseViewCallback): Factory|View|JsonResponse
    {
        $rendered = $view->renderSections();
        $contentNodeData = [
            'linkNodeId'    => $rendered['link-node-id'] ?? '',
            'title'         => $rendered['content-node-title'],
            'body'          => $rendered['content-node-body'],
            'footer'        => $rendered['content-node-footer'] ?? '',
            'documentTitle' => $rendered['content-node-title'] . ' | ホラーゲームネットワーク',
        ];
        if (self::isAjax()) {
            return response()->json($contentNodeData);
        } else {
            $view = $baseViewCallback();
            $view->with('contentNodeData', $contentNodeData);
            return $view;
        }
    }
}

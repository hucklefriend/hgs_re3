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
     * ネットワークの生成
     *
     * @param Factory|View $view
     * @return JsonResponse|Application|Factory|View
     * @throws \Throwable
     */
    protected function network(Factory|View $view): JsonResponse|Application|Factory|View
    {
        // javascriptのFetch APIでアクセスされていたら、layoutを使わずにテキストを返す
        if (self::isAjax()) {
            $rendered = $view->renderSections();
            return response()->json([
                'title'   => $rendered['title'],
                'network' => $rendered['content'],
                'popup'   => $rendered['popup'] ?? '',
            ]);
        }

        return $view;
    }

    /**
     * コンテンツノードの表示
     *
     * @param Factory|View $view
     * @return Factory|View|JsonResponse
     * @throws \Throwable
     */
    protected function contentNode(Factory|View $view): Factory|View|JsonResponse
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
            $infoList = Information::where('open_at', '<', now())
                ->where('close_at', '>=', now())
                ->orderBy('priority', 'desc')
                ->orderBy('open_at', 'desc')
                ->get();
            return view('entrance', [
                'contentNode' => $contentNodeData,
                'infoList'    => $infoList,
            ]);
        }
    }
}

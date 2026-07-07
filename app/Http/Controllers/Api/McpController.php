<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameFranchise;
use App\Models\GameMediaMixGroup;
use App\Models\GameSeries;
use App\Services\MasterJson\FranchiseMasterJsonService;
use App\Services\MasterJson\MediaMixGroupMasterJsonService;
use App\Services\MasterJson\SeriesMasterJsonService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class McpController extends Controller
{
    private const ENTITY_CONFIG = [
        'series' => [
            'label'          => 'シリーズ',
            'model'          => GameSeries::class,
            'search_columns' => ['name', 'phonetic'],
            'fields'         => [
                ['key' => 'name',               'label' => '名前',                 'type' => 'string', 'required' => true,  'maxlength' => 200],
                ['key' => 'phonetic',            'label' => 'よみがな',             'type' => 'string', 'required' => true,  'maxlength' => 200, 'note' => 'ひらがな・長音符（ー）・数字のみ'],
                ['key' => 'node_name',           'label' => 'ノード表示用の名前',   'type' => 'string', 'required' => true,  'maxlength' => 200],
                ['key' => 'description',         'label' => '説明文',               'type' => 'text'],
                ['key' => 'description_source',  'label' => '説明文の引用元',       'type' => 'text'],
            ],
        ],
        'franchise' => [
            'label'          => 'フランチャイズ',
            'model'          => GameFranchise::class,
            'search_columns' => ['name', 'phonetic'],
            'fields'         => [
                ['key' => 'name',               'label' => '名前',                 'type' => 'string', 'required' => true,  'maxlength' => 200],
                ['key' => 'phonetic',            'label' => 'よみがな',             'type' => 'string', 'required' => true,  'maxlength' => 200, 'note' => 'ひらがな・長音符（ー）・数字のみ'],
                ['key' => 'node_name',           'label' => 'ノード表示用の名前',   'type' => 'string', 'required' => true,  'maxlength' => 200],
                ['key' => 'description',         'label' => '説明文',               'type' => 'text'],
                ['key' => 'description_source',  'label' => '説明文の引用元',       'type' => 'text'],
                ['key' => 'rating',              'label' => 'レーティング',         'type' => 'enum',   'required' => true,
                    'enum_values' => [
                        ['value' => 0, 'label' => '全年齢'],
                        ['value' => 2, 'label' => 'R-18Z'],
                        ['value' => 3, 'label' => 'R-18A'],
                    ],
                ],
            ],
        ],
        'media_mix_group' => [
            'label'          => 'メディアミックスグループ',
            'model'          => GameMediaMixGroup::class,
            'search_columns' => ['name'],
            'fields'         => [
                ['key' => 'name',        'label' => '名前',               'type' => 'string', 'required' => true, 'maxlength' => 200],
                ['key' => 'node_name',   'label' => 'ノード表示用の名前', 'type' => 'string', 'required' => true, 'maxlength' => 200],
                ['key' => 'description', 'label' => '説明文',             'type' => 'text'],
            ],
        ],
    ];

    public function schema(string $type): JsonResponse
    {
        $config = self::ENTITY_CONFIG[$type] ?? null;

        if ($config === null) {
            return response()->json(['message' => 'Unknown entity type.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'type'   => $type,
            'label'  => $config['label'],
            'fields' => $config['fields'],
        ]);
    }

    public function entities(Request $request, string $type): JsonResponse
    {
        $config = self::ENTITY_CONFIG[$type] ?? null;

        if ($config === null) {
            return response()->json(['message' => 'Unknown entity type.'], Response::HTTP_NOT_FOUND);
        }

        $perPage = (int) $request->query('per_page', 20);
        if ($perPage < 1) {
            $perPage = 1;
        }
        if ($perPage > 100) {
            $perPage = 100;
        }

        $q = trim((string) $request->query('q', ''));

        /** @var \Illuminate\Database\Eloquent\Model $modelClass */
        $modelClass = $config['model'];
        $query = $modelClass::query()->orderBy('id');

        if ($q !== '') {
            $words   = array_values(array_filter(preg_split('/\s+/u', $q) ?: [], fn ($w) => $w !== ''));
            $columns = $config['search_columns'];

            if ($words !== []) {
                $query->where(function (Builder $outer) use ($words, $columns) {
                    foreach ($words as $word) {
                        $outer->where(function (Builder $inner) use ($word, $columns) {
                            foreach ($columns as $i => $col) {
                                if ($i === 0) {
                                    $inner->where($col, 'LIKE', '%' . $word . '%');
                                } else {
                                    $inner->orWhere($col, 'LIKE', '%' . $word . '%');
                                }
                            }
                        });
                    }
                });
            }
        }

        $paginator = $query->paginate($perPage)->appends($request->query());

        $data = collect($paginator->items())
            ->map(fn ($m) => ['id' => $m->id, 'name' => $m->name])
            ->values()
            ->all();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    public function export(string $type, int $id): JsonResponse
    {
        $config = self::ENTITY_CONFIG[$type] ?? null;

        if ($config === null) {
            return response()->json(['message' => 'Unknown entity type.'], Response::HTTP_NOT_FOUND);
        }

        $modelClass = $config['model'];
        $model      = $modelClass::query()->find($id);

        if ($model === null) {
            return response()->json(['message' => 'Not Found'], Response::HTTP_NOT_FOUND);
        }

        if ($type === 'series') {
            $json = app(SeriesMasterJsonService::class)->export($model);
        } elseif ($type === 'franchise') {
            $json = app(FranchiseMasterJsonService::class)->export($model);
        } else {
            $json = app(MediaMixGroupMasterJsonService::class)->export($model);
        }

        return response()->json(['data' => $json]);
    }

    public function diff(Request $request, string $type, int $id): JsonResponse
    {
        $config = self::ENTITY_CONFIG[$type] ?? null;

        if ($config === null) {
            return response()->json(['message' => 'Unknown entity type.'], Response::HTTP_NOT_FOUND);
        }

        $modelClass = $config['model'];
        $model      = $modelClass::query()->find($id);

        if ($model === null) {
            return response()->json(['message' => 'Not Found'], Response::HTTP_NOT_FOUND);
        }

        $importedJson = (string) $request->input('imported_json', '');

        if ($importedJson === '') {
            return response()->json(['message' => 'imported_json is required.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($type === 'series') {
            $diff = app(SeriesMasterJsonService::class)->diff($model, $importedJson);
        } elseif ($type === 'franchise') {
            $diff = app(FranchiseMasterJsonService::class)->diff($model, $importedJson);
        } else {
            $diff = app(MediaMixGroupMasterJsonService::class)->diff($model, $importedJson);
        }

        if (!empty($diff['errors'])) {
            return response()->json(['errors' => $diff['errors']], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['data' => $diff]);
    }
}

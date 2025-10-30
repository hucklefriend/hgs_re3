<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\GameMaker;
use App\Http\Requests\Api\V1\GameMakerRequest;
use Illuminate\Http\JsonResponse;

class GameMakerController extends Controller
{
    /**
     * 全件取得
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json(GameMaker::all());
    }

    /**
     * 単一取得
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $gameMaker = GameMaker::with('synonyms')->find($id);
        if (!$gameMaker) {
            return response()->json(['message' => 'GameMaker not found'], 404);
        }
        
        $response = $gameMaker->toArray();
        $response['synonyms'] = $gameMaker->synonyms->pluck('synonym')->toArray();
        
        return response()->json($response);
    }

    /**
     * 作成
     * 
     * @param GameMakerRequest $request
     * @return JsonResponse
     */
    public function store(GameMakerRequest $request): JsonResponse
    {
        $gameMaker = GameMaker::create($request->validated());
        return response()->json($gameMaker, 201);
    }

    /**
     * 更新
     * 
     * @param GameMakerRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(GameMakerRequest $request, $id): JsonResponse
    {
        $gameMaker = GameMaker::find($id);
        if (!$gameMaker) {
            return response()->json(['message' => 'GameMaker not found'], 404);
        }

        $gameMaker->update($request->validated());
        return response()->json($gameMaker);
    }

    /**
     * 削除
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        $gameMaker = GameMaker::find($id);
        if (!$gameMaker) {
            return response()->json(['message' => 'GameMaker not found'], 404);
        }

        $gameMaker->delete();
        return response()->json(['message' => 'GameMaker deleted']);
    }

    // 
}

<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameMaker;
use Illuminate\Http\Request;

class GameMakerController extends Controller
{
    // 全件取得
    public function index()
    {
        return response()->json(GameMaker::all());
    }

    // 単一取得
    public function show($id)
    {
        $gameMaker = GameMaker::find($id);
        if (!$gameMaker) {
            return response()->json(['message' => 'GameMaker not found'], 404);
        }
        return response()->json($gameMaker);
    }

    // 作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|unique:game_makers,key|max:50',
            'name' => 'required|max:200',
            'node_name' => 'required|max:200',
            'h1_node_name' => 'required|max:200',
            'description' => 'nullable|string',
            'description_source' => 'nullable|string',
            'related_game_maker_id' => 'nullable|integer'
        ]);

        $gameMaker = GameMaker::create($validated);
        return response()->json($gameMaker, 201);
    }

    // 更新
    public function update(Request $request, $id)
    {
        $gameMaker = GameMaker::find($id);
        if (!$gameMaker) {
            return response()->json(['message' => 'GameMaker not found'], 404);
        }

        $validated = $request->validate([
            'key' => 'sometimes|unique:game_makers,key|max:50',
            'name' => 'sometimes|max:200',
            'node_name' => 'sometimes|max:200',
            'h1_node_name' => 'sometimes|max:200',
            'description' => 'nullable|string',
            'description_source' => 'nullable|string',
            'related_game_maker_id' => 'nullable|integer'
        ]);

        $gameMaker->update($validated);
        return response()->json($gameMaker);
    }

    // 削除
    public function destroy($id)
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

<?php

use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GameMakerController as GameMakerApi;

Route::get('/', [GameController::class, 'searchHorrorGame'])->name('Api.Game.SearchHorrorGame');

Route::middleware(['gpts.api_key'])->group(function () {
    Route::apiResource('game-makers', GameMakerApi::class);
    Route::group(['prefix' => 'game/makers'], function () {

    });
});
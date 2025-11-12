<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\GameMakerController as GameMakerApi;

Route::get('/', [GameController::class, 'searchHorrorGame'])->name('Api.Game.SearchHorrorGame');

Route::middleware(['gpts.api_key'])->group(function () {
    // V1
    Route::prefix('v1')->name('api.v1.')->group(function () {
        // ゲームメーカー
        Route::apiResource('game-makers', GameMakerApi::class);
    });
});

if (app()->environment('local')) {
    Route::get('test/registration-url', [AccountController::class, 'getRegistrationUrlForTest'])->name('api.test.registration-url');
}



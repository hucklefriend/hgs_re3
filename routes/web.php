<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

use \App\Http\Controllers\Admin;
// 管理用
Route::group(['prefix' => 'admin', 'middleware' => [/*'auth', 'can:admin', */'admin']], function () {
    // 管理
    Route::get('/', [Admin\AdminController::class, 'top'])->name('Admin');

    // マスター
    Route::group(['prefix' => 'master'], function () {
        // メーカー
        Route::group(['prefix' => 'maker'], function () {
            $basename = 'Admin.MasterData.Maker';
            Route::get('/', [Admin\GameMakerController::class, 'index'])->name($basename);
            Route::get('add', [Admin\GameMakerController::class, 'add'])->name("{$basename}.Add");
            Route::post('add', [Admin\GameMakerController::class, 'store'])->name("{$basename}.Store");
            Route::get('{maker}/edit', [Admin\GameMakerController::class, 'edit'])->name("{$basename}.Edit");
            Route::put('{maker}/edit', [Admin\GameMakerController::class, 'update'])->name("{$basename}.Update");
            Route::get('{maker}', [Admin\GameMakerController::class, 'detail'])->name("{$basename}.Detail");
            Route::delete('{maker}', [Admin\GameMakerController::class, 'delete'])->name("{$basename}.Delete");
        });

        // プラットフォーム
        Route::group(['prefix' => 'platform'], function () {
            $basename = 'Admin.MasterData.Platform';
            Route::get('/', [Admin\GamePlatformController::class, 'index'])->name($basename);
            Route::get('add', [Admin\GamePlatformController::class, 'add'])->name("{$basename}.Add");
            Route::post('add', [Admin\GamePlatformController::class, 'store'])->name("{$basename}.Store");
            Route::get('{platform}/edit', [Admin\GamePlatformController::class, 'edit'])->name("{$basename}.Edit");
            Route::put('{platform}/edit', [Admin\GamePlatformController::class, 'update'])->name("{$basename}.Update");
            Route::get('{platform}', [Admin\GamePlatformController::class, 'detail'])->name("{$basename}.Detail");
            Route::delete('{platform}', [Admin\GamePlatformController::class, 'delete'])->name("{$basename}.Delete");
        });
    });
});


Route::get('/', function () {
    return view('suspend');
});

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

use \App\Http\Controllers\Admin\AdminController;
// 管理用
Route::group(['prefix' => 'admin'/*, 'middleware' => ['auth', 'can:admin', 'management']*/], function () {
    // 管理
    Route::get('/', [AdminController::class, 'top'])->name('管理');
});


Route::get('/', function () {
    return view('suspend');
});

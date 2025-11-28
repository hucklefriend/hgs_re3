<?php

use App\Http\Controllers\Api\Test\AccountController;
use App\Http\Controllers\Api\UserFavoriteController;
use Illuminate\Support\Facades\Route;

if (!app()->environment('production')) {
    Route::get('test/registration-url', [AccountController::class, 'getRegistrationUrlForTest'])->name('api.test.registration-url');
    Route::get('test/password-reset-url', [AccountController::class, 'getPasswordResetUrlForTest'])->name('api.test.password-reset-url');
}

// 認証が必要なAPI
Route::middleware(['web', 'auth:web'])->group(function () {
    Route::post('user/favorite/toggle', [UserFavoriteController::class, 'toggle'])->name('api.user.favorite.toggle');
});



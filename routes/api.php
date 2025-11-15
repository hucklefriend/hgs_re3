<?php

use App\Http\Controllers\Api\Test\AccountController;
use Illuminate\Support\Facades\Route;

if (app()->environment('local')) {
    Route::get('test/registration-url', [AccountController::class, 'getRegistrationUrlForTest'])->name('api.test.registration-url');
    Route::get('test/password-reset-url', [AccountController::class, 'getPasswordResetUrlForTest'])->name('api.test.password-reset-url');
}



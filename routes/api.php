<?php

use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;

Route::get('/', [GameController::class, 'searchHorrorGame'])->name('Api.Game.SearchHorrorGame');

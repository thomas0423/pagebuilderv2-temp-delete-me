<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('pages', PageController::class);
    Route::post('pages/{page}/publish', [PageController::class, 'publish']);

    Route::apiResource('products', ProductController::class);
    Route::apiResource('menus', MenuController::class)->except(['show']);
    Route::apiResource('users', UserController::class)->except(['show']);
    Route::get('media', [MediaController::class, 'index']);
    Route::post('media', [MediaController::class, 'store']);
    Route::delete('media/{medium}', [MediaController::class, 'destroy']);

    Route::get('settings', [SettingController::class, 'index']);
    Route::match(['put', 'patch', 'post'], 'settings', [SettingController::class, 'update']);

    Route::post('ai/generate', [AiController::class, 'generate']);
});

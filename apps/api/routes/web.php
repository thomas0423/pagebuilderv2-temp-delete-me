<?php

use App\Http\Controllers\PublicPageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicPageController::class, 'home']);
Route::get('/p/{slug}', [PublicPageController::class, 'show'])->name('pages.public');
Route::get('/preview/{slug}', [PublicPageController::class, 'preview'])->name('pages.preview');

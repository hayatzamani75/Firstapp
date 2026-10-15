<?php

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:employee-only'])->group(function () {
    Route::get('/book', [BookController::class, 'view'])->name('book.view');
    Route::post('/book', [BookController::class, 'store'])->name('book.store');
    Route::put('/book/{book}', [BookController::class, 'update'])->name('book.update');
    Route::delete('/book/{book}', [BookController::class, 'destroy'])->name('book.destroy');
});

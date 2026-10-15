<?php

use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:employee-only'])->group(function () {
    Route::get('/service', [ServiceController::class, 'view'])->name('service.view');
    Route::post('/service', [ServiceController::class, 'store'])->name('service.store');
    Route::put('/service/{service}', [ServiceController::class, 'update'])->name('service.update');
    Route::delete('/service/{service}', [ServiceController::class, 'destroy'])->name('service.destroy');
});

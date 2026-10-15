<?php

use App\Http\Controllers\InternshipController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:employee-only'])->group(function () {
    Route::get('/internship', [InternshipController::class, 'view'])->name('internship.view');
    Route::post('/internship', [InternshipController::class, 'store'])->name('internship.store');
    Route::put('/internship/{internship}', [InternshipController::class, 'update'])->name('internship.update');
    Route::delete('/internship/{internship}', [InternshipController::class, 'destroy'])->name('internship.destroy');
});

<?php

use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:employee-only'])->group(function () {
    Route::get('/teacher', [TeacherController::class, 'view'])->name('teacher.view');
    Route::post('/teacher', [TeacherController::class, 'store'])->name('teacher.store');
    Route::put('/teacher/{teacher}', [TeacherController::class, 'update'])->name('teacher.update');
    Route::delete('/teacher/{teacher}', [TeacherController::class, 'destroy'])->name('teacher.destroy');
});

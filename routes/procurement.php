<?php

use App\Http\Controllers\ProcurementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:employee-only'])->group(function () {
    Route::get('/procurement', [ProcurementController::class, 'index'])->name('procurement.view');
    Route::post('/procurement', [ProcurementController::class, 'store'])->name('procurement.store');
    Route::put('/procurement/{procurement}', [ProcurementController::class, 'update'])->name('procurement.update');
    Route::delete('/procurement/{procurement}', [ProcurementController::class, 'destroy'])->name('procurement.destroy');
    Route::patch('/procurement/{procurement}/receive', [ProcurementController::class, 'receive'])->name('procurement.receive');
});

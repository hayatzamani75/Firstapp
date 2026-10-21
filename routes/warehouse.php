<?php

use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'can:employee-only'])->group(function () {
    Route::get('/warehouse', [WarehouseController::class, 'index'])->name('warehouse.view');
    Route::post('/warehouse/movements', [WarehouseController::class, 'storeMovement'])->name('warehouse.movements.store');
});

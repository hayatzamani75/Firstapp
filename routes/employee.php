<?php

use App\Http\Controllers\EmployeeAccountController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/employee', [EmployeeController::class, 'view'])->name('employee.view');
    Route::post('/employee', [EmployeeController::class, 'store'])->name('employee.store');
    Route::put('/employee/{employee}', [EmployeeController::class, 'update'])->name('employee.update');
    Route::delete('/employee/{employee}', [EmployeeController::class, 'destroy'])->name('employee.destroy');

    Route::post('/employee/accounts', [EmployeeAccountController::class, 'store'])
        ->middleware('can:manage-employees')
        ->name('employee.account.store');
});
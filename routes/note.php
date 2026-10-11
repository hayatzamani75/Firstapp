<?php

use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/note', [NoteController::class, 'view'])->name('profile.view')->middleware(['auth', 'verified'])->name('profile.view');
// Route::get('/note', function () {
//     return Inertia::render('Note/View');
// })->middleware(['auth', 'verified'])->name('profile.view');
// Route::get('/note', function () {
//     return Inertia::render('Note/Note'); // Just use 'Note', not 'Note/index'
// })->name('note.index');
// Route::get('store', [NoteController::class, 'store']);
// Route::get('store', [NoteController::class, 'store']);


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/note', [NoteController::class, 'view'])->name('note.view');
    Route::post('/note', [NoteController::class, 'store'])->name('note.store');
    Route::put('/note/{note}', [NoteController::class, 'update'])->name('note.update');
    Route::delete('/note/{note}', [NoteController::class, 'destroy'])->name('note.destroy');
});

<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/product', [ProductController::class, 'index'])->name('product.view');
    Route::post('/product', [ProductController::class, 'store'])->name('product.store');
    Route::post('/product/cart/items', [ProductController::class, 'addToCart'])->name('product.cart.add');
    Route::patch('/product/cart/items', [ProductController::class, 'updateCart'])->name('product.cart.update');
    Route::delete('/product/cart/items', [ProductController::class, 'removeFromCart'])->name('product.cart.remove');
});

Route::get('/education', function () {
    return Inertia::render('Education');
})->middleware(['auth', 'verified'])->name('education.view');

// Route::get('/note', function () {
//     return Inertia::render('Note/Note');
// })->middleware(['auth', 'verified'])->name('note');

Route::middleware('auth')->group(function () {


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/note.php';
require __DIR__.'/book.php';
require __DIR__.'/company.php';
require __DIR__.'/teacher.php';
require __DIR__.'/customer.php';
require __DIR__.'/internship.php';
require __DIR__.'/employee.php';
require __DIR__.'/service.php';
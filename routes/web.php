<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ManagerAccountController;
use App\Http\Controllers\NoteController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('StoreHome', [
        'categories' => Product::query()
            ->select('category')
            ->selectRaw('COUNT(*) as products_count')
            ->groupBy('category')
            ->orderBy('category')
            ->get()
            ->map(fn (Product $product) => [
                'name' => $product->category,
                'products_count' => (int) $product->products_count,
            ])
            ->values(),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified', 'can:employee-only'])->name('dashboard');

Route::get('/product', [ProductController::class, 'index'])->name('product.view');
Route::get('/product-list', [ProductController::class, 'index'])->name('product.list');
Route::get('/categories', [ProductController::class, 'categories'])->name('categories.view');
Route::get('/product/{product}/image', [ProductController::class, 'image'])->name('product.image');
Route::post('/product/cart/items', [ProductController::class, 'addToCart'])->name('product.cart.add');
Route::patch('/product/cart/items', [ProductController::class, 'updateCart'])->name('product.cart.update');
Route::delete('/product/cart/items', [ProductController::class, 'removeFromCart'])->name('product.cart.remove');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/product', [ProductController::class, 'store'])->middleware('can:employee-only')->name('product.store');
    Route::put('/product/{product}', [ProductController::class, 'update'])->middleware('can:employee-only')->name('product.update');
    Route::delete('/product/{product}', [ProductController::class, 'destroy'])->middleware('can:employee-only')->name('product.destroy');
    Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel'])->middleware('can:employee-only')->name('orders.cancel');
    Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->middleware('can:employee-only')->name('orders.destroy');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->middleware('can:employee-only')->name('orders.status');
    Route::patch('/orders/{order}/reply', [OrderController::class, 'updateReply'])->middleware('can:employee-only')->name('orders.reply');
    Route::patch('/notifications/{notification}/read', [OrderController::class, 'markNotificationRead'])->middleware('can:employee-only')->name('notifications.read');
    Route::post('/manager/accounts', [ManagerAccountController::class, 'store'])->middleware('can:employee-only')->name('manager.account.store');
});

Route::get('/orders', [OrderController::class, 'index'])
    ->middleware(['auth', 'can:store-customer'])
    ->name('orders.index');

Route::post('/checkout', [OrderController::class, 'checkout'])
    ->middleware(['auth', 'can:store-customer'])
    ->name('checkout.store');

Route::get('/education', function () {
    return Inertia::render('Education');
})->middleware(['auth', 'verified', 'can:employee-only'])->name('education.view');

// Route::get('/note', function () {
//     return Inertia::render('Note/Note');
// })->middleware(['auth', 'verified'])->name('note');

Route::middleware(['auth', 'can:employee-only'])->group(function () {


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
require __DIR__.'/warehouse.php';
require __DIR__.'/procurement.php';

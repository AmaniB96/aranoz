<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\MainController; // AJOUT
use App\Http\Controllers\ShopProductController;
use App\Http\Controllers\CartController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// DASHBOARD ACCESSIBLE À TOUS LES RÔLES ADMIN (sauf user et public)
Route::middleware(['auth', 'role:admin,agent,webmaster,cm'])->group(function () {
    Route::get('/admin', [MainController::class, 'index'])->name('admin.dashboard'); // UTILISE LE CONTROLLER
});

// Routes ADMIN uniquement
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/user', [UserController::class, 'index'])->name('user');
    Route::put('/admin/user/{id}', [UserController::class, 'update'])->name('userUpdate');
    Route::delete('/admin/user/{id}', [UserController::class, 'destroy'])->name('userDelete');
    
    Route::get('/admin/categories', [CategoriesController::class, 'index'])->name('categories');
    Route::post('/admin/categories', [CategoriesController::class, 'create'])->name('createCat');
    Route::delete('/admin/categories/{id}', [CategoriesController::class, 'destroy'])->name('deleteCat');
});

// Routes WEBMASTER + ADMIN
Route::middleware(['auth', 'role:webmaster,admin'])->group(function () {
    Route::get('/admin/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/admin/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/admin/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/admin/products/{id}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/admin/products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/admin/products/{id}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');
    
    Route::get('/admin/contact', [ContactController::class, 'index'])->name('contact');
    Route::put('/admin/contact/{id}', [ContactController::class, 'update'])->name('contactUpdate');
});

// Routes AGENT + ADMIN
Route::middleware(['auth', 'role:agent,admin'])->group(function () {
    Route::get('/admin/orders', [OrderController::class, 'index'])->name('orders');
    Route::put('/admin/orders/{id}', [OrderController::class, 'update'])->name('ordersUpdate');
    
    Route::get('/admin/mailbox', [MailController::class, 'index'])->name('mailbox.index');
    Route::get('/admin/mailbox/archived', [MailController::class, 'archived'])->name('mailbox.archived');
    Route::get('/admin/mailbox/{id}', [MailController::class, 'show'])->name('mailbox.show');
    Route::put('/admin/mailbox/{id}/archive', [MailController::class, 'archive'])->name('mailbox.archive');
    Route::put('/admin/mailbox/{id}/unarchive', [MailController::class, 'unarchive'])->name('mailbox.unarchive');
    Route::post('/admin/mailbox/{id}/reply', [MailController::class, 'reply'])->name('mailbox.reply');
    Route::delete('/admin/mailbox/{id}', [MailController::class, 'destroy'])->name('mailbox.destroy');
});

// Routes CM + ADMIN
Route::middleware(['auth', 'role:cm,admin'])->group(function () {
    Route::get('/admin/blogs', [BlogController::class, 'index'])->name('blogs.index');
    Route::get('/admin/blogs/create', [BlogController::class, 'create'])->name('blogs.create');
    Route::post('/admin/blogs', [BlogController::class, 'store'])->name('blogs.store');
    Route::get('/admin/blogs/{id}', [BlogController::class, 'show'])->name('blogs.show');
    Route::get('/admin/blogs/{id}/edit', [BlogController::class, 'edit'])->name('blogs.edit');
    Route::put('/admin/blogs/{id}', [BlogController::class, 'update'])->name('blogs.update');
    Route::delete('/admin/blogs/{id}', [BlogController::class, 'destroy'])->name('blogs.destroy');
});

Route::get('/shop', [ShopController::class, 'index'])->name('shop');

Route::middleware(['auth'])->group(function () {
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove/{id}', [CartController::class, 'remove'])->name('cart.remove');
});

Route::get('/products/{id}', [ShopProductController::class, 'show'])->name('products.show');


require __DIR__.'/auth.php';

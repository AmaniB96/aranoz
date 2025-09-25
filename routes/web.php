<?php

use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
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

Route::get('/admin/categories', [CategoriesController::class, 'index'])->name('categories');
Route::post('/admin/categories', [CategoriesController::class, 'create'])->name('createCat');
Route::delete('/admin/categories/{id}', [CategoriesController::class, 'destroy'])->name('deleteCat');

Route::get('/admin/contact', [ContactController::class, 'index'])->name('contact');
Route::put('/admin/contact/{id}', [ContactController::class, 'update'])->name('contactUpdate');

Route::get('/admin/user', [UserController::class, 'index'])->name('user');
Route::put('/admin/user/{id}', [UserController::class, 'update'])->name('userUpdate');
Route::delete('/admin/user/{id}',[UserController::class, 'destroy'])->name('userDelete');

require __DIR__.'/auth.php';

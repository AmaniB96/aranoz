<?php

use App\Http\Controllers\BlogCommentController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\ShopProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LikedProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// ROUTES DE SERVICE D'IMAGES (EN PREMIER !)
// ========================================
Route::get('/storage/products/{folder}/{filename}', function ($folder, $filename) {
    $allowedFolders = ['card', 'show', 'carousel', 'panier'];
    
    if (!in_array($folder, $allowedFolders)) {
        abort(404);
    }
    
    $path = storage_path("app/public/products/{$folder}/{$filename}");
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()->file($path, [
        'Content-Type' => mime_content_type($path),
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('filename', '.*');

Route::get('/storage/blog/{filename}', function ($filename) {
    $path = storage_path("app/public/blog/{$filename}");
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()->file($path, [
        'Content-Type' => mime_content_type($path),
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('filename', '.*');

// ========================================
// ROUTES PUBLIQUES
// ========================================
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
    Route::post('/admin/products/{id}/toggle-pin', [ProductController::class, 'togglePin'])->name('products.togglePin');
    
    // Coupons routes
    Route::get('/admin/coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::get('/admin/coupons/create', [CouponController::class, 'create'])->name('coupons.create');
    Route::post('/admin/coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::get('/admin/coupons/{id}', [CouponController::class, 'show'])->name('coupons.show');
    Route::get('/admin/coupons/{id}/edit', [CouponController::class, 'edit'])->name('coupons.edit');
    Route::put('/admin/coupons/{id}', [CouponController::class, 'update'])->name('coupons.update');
    Route::delete('/admin/coupons/{id}', [CouponController::class, 'destroy'])->name('coupons.destroy');
    
    // Promos routes
    Route::get('/admin/promos', [PromoController::class, 'index'])->name('promos.index');
    Route::get('/admin/promos/create', [PromoController::class, 'create'])->name('promos.create');
    Route::post('/admin/promos', [PromoController::class, 'store'])->name('promos.store');
    Route::get('/admin/promos/{id}', [PromoController::class, 'show'])->name('promos.show');
    Route::get('/admin/promos/{id}/edit', [PromoController::class, 'edit'])->name('promos.edit');
    Route::put('/admin/promos/{id}', [PromoController::class, 'update'])->name('promos.update');
    Route::delete('/admin/promos/{id}', [PromoController::class, 'destroy'])->name('promos.destroy');
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
    
    Route::post('/cart/apply-coupon', [CartController::class, 'applyCoupon'])->name('cart.apply-coupon');
    Route::post('/cart/remove-coupon', [CartController::class, 'removeCoupon'])->name('cart.remove-coupon');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/products/{productId}/like', [LikedProductController::class, 'toggle'])->name('products.like');
    Route::get('/user/liked-products', [LikedProductController::class, 'userIndex'])->name('user.liked-products');
});

// Route admin pour voir les likes
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/liked-products', [LikedProductController::class, 'adminIndex'])->name('admin.liked-products');
});

// Route pour afficher un produit côté public
Route::get('/products/{id}', [ProductController::class, 'showPublic'])->name('products.show.public');

// Route publique pour la page contact
Route::get('/contact', [ContactController::class, 'publicIndex'])->name('contact.public');

// Routes publiques pour le blog
Route::get('/blog', [BlogController::class, 'publicIndex'])->name('blog.index');
Route::get('/blog/{id}', [BlogController::class, 'publicShow'])->name('blog.show');
Route::get('/blog/category/{id}', [BlogController::class, 'publicByCategory'])->name('blog.category');
Route::get('/blog/tag/{id}', [BlogController::class, 'publicByTag'])->name('blog.tag');

// Route pour poster un commentaire (utilisateurs connectés seulement)
Route::middleware(['auth'])->group(function () {
    Route::post('/blog/{id}/comment', [BlogCommentController::class, 'store'])->name('blog.comment.store');
});

// Routes pour le système de commandes (checkout et suivi)
Route::middleware(['auth'])->group(function () {
    // AJOUTER LA ROUTE GET POUR AFFICHER LA PAGE CHECKOUT
    Route::get('/checkout', [OrderController::class, 'checkoutPage'])->name('checkout.page');
    
    // RENOMMER LA ROUTE POST POUR LE TRAITEMENT DU PAIEMENT
    Route::post('/orders/simulate-payment', [OrderController::class, 'simulatePayment'])->name('orders.simulate-payment');
    
    Route::get('/orders/success/{id}', [OrderController::class, 'success'])->name('orders.success');
    Route::get('/orders/tracking', [OrderController::class, 'tracking'])->name('orders.tracking');
    Route::get('/orders/history', [OrderController::class, 'history'])->name('orders.history');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
});

Route::get('/contact', [ContactController::class, 'publicIndex'])->name('contact');
Route::post('/contact/send-message', [ContactController::class, 'sendMessage'])->name('contact.send-message');

// API route for coupon validation
Route::post('/api/coupons/validate', [CouponController::class, 'validateCoupon'])->name('api.coupons.validate');

// Ajouter après les routes storage

Route::get('/debug/upload-test', function () {
    // Simuler un upload
    $testFilename = '1759913668_SobwytISFu.png';
    
    $paths = [
        'source' => storage_path("app/public/products/{$testFilename}"),
        'card' => storage_path("app/public/products/card/{$testFilename}"),
        'show' => storage_path("app/public/products/show/{$testFilename}"),
        'carousel' => storage_path("app/public/products/carousel/{$testFilename}"),
        'panier' => storage_path("app/public/products/panier/{$testFilename}"),
    ];
    
    $results = [];
    foreach ($paths as $name => $path) {
        $results[$name] = [
            'path' => $path,
            'exists' => file_exists($path),
            'readable' => file_exists($path) && is_readable($path),
            'size' => file_exists($path) ? filesize($path) : null,
        ];
    }
    
    return [
        'test_filename' => $testFilename,
        'paths' => $results,
        'latest_logs' => array_slice(file(storage_path('logs/laravel.log')), -50),
    ];
});

require __DIR__.'/auth.php';

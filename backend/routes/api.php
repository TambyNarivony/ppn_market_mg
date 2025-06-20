<?php

// routes/api.php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/categories', [AdminController::class, 'getCategories']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search', [ProductController::class, 'search']);

Route::get('/products/{id}', [ProductController::class, 'show']);


Route::post('/get-token', function (Request $request) {
    $user = \App\Models\User::where('email', $request->email)->first();
    if (!$user || !\Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
    return response()->json(['token' => $user->createToken('api-token')->plainTextToken]);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/cart', [CartController::class, 'addToCart']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/pending', [OrderController::class, 'getPendingUserOrders']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/orders/history', [OrderController::class, 'getUserOrderHistory']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // CRUD Produits
    Route::post('/products', [AdminController::class, 'storeProduct']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);

    // CRUD Sous-produits
    Route::put('/sub_products/{id}', [AdminController::class, 'updateSubProduct']);
    Route::delete('/sub_products/{id}', [AdminController::class, 'deleteSubProduct']);

    // CRUD Catégories
    Route::post('/categories', [AdminController::class, 'storeCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);

    // Gestion des commandes
    Route::put('/orders/{order}/validate', [AdminController::class, 'validateOrder']);
    Route::get('/orders/pending/nonValide', [AdminController::class, 'getPendingOrders']);
});

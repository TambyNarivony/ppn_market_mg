<?php

// app/Http/Controllers/API/CartController.php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SubProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $request->validate([
            'sub_product_id' => 'required|exists:sub_products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $subProduct = SubProduct::find($request->sub_product_id);
        $user = Auth::user();

        // Dans une vraie application, on stockerait le panier en base
        // Pour cette démo, nous allons simuler le stockage
        // Le frontend gère le panier dans son état local

        return response()->json([
            'message' => 'Product added to cart',
            'product' => $subProduct,
            'quantity' => $request->quantity
        ]);
    }
}

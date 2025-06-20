<?php

// app/Http/Controllers/API/ProductController.php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product; // Make sure this is correctly namespaced if different
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('subProducts')->get();
        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::with('subProducts')->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    /**
     * Search for products by name or description.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $query = $request->input('q'); // Get the search query from the 'q' parameter

        if (!$query) {
            return response()->json(['message' => 'Search query is missing'], 400);
        }

        // Search products where name or description contains the query
        // Eager load subProducts as well
        $products = Product::with('subProducts')
                            ->where('name', 'like', '%' . $query . '%')
                            ->orWhere('description', 'like', '%' . $query . '%')
                            ->get();

        return response()->json($products);
    }

    
}

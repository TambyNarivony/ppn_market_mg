<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\SubProduct;
use App\Models\Category;
use App\Models\Order;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function storeProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'sub_products' => 'required|array',
            'sub_products.*.brand' => 'required|string',
            'sub_products.*.price' => 'required|numeric',
            'sub_products.*.stock' => 'required|integer',
            'sub_products.*.image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
        ]);

        foreach ($request->sub_products as $sub) {
            SubProduct::create([
                'product_id' => $product->id,
                'brand' => $sub['brand'],
                'price' => $sub['price'],
                'stock' => $sub['stock'],
                'image_url' => $sub['image_url'] ?? null,
            ]);
        }

        return response()->json($product->load('subProducts'), 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'sub_products' => 'sometimes|array',
            'sub_products.*.id' => 'nullable|exists:sub_products,id',
            'sub_products.*.brand' => 'required|string',
            'sub_products.*.price' => 'required|numeric',
            'sub_products.*.stock' => 'required|integer',
            'sub_products.*.image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $product->update($request->only(['name', 'description', 'category_id']));

        if ($request->has('sub_products')) {
            $existingSubProductIds = $product->subProducts->pluck('id')->toArray();
            $newSubProductIds = collect($request->sub_products)->pluck('id')->filter()->toArray();

            $toDelete = array_diff($existingSubProductIds, $newSubProductIds);
            SubProduct::whereIn('id', $toDelete)->delete();

            foreach ($request->sub_products as $subData) {
                if (isset($subData['id']) && $subData['id']) {
                    $subProduct = SubProduct::find($subData['id']);
                    if ($subProduct) {
                        $subProduct->update([
                            'brand' => $subData['brand'],
                            'price' => $subData['price'],
                            'stock' => $subData['stock'],
                            'image_url' => $subData['image_url'] ?? null,
                        ]);
                    }
                } else {
                    SubProduct::create([
                        'product_id' => $product->id,
                        'brand' => $subData['brand'],
                        'price' => $subData['price'],
                        'stock' => $subData['stock'],
                        'image_url' => $subData['image_url'] ?? null,
                    ]);
                }
            }
        }

        return response()->json($product->load(['subProducts', 'category']));
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->subProducts()->delete();

        $product->delete();

        return response()->json(['message' => 'Product and all sub-products deleted successfully']);
    }

    public function updateSubProduct(Request $request, $id)
    {
        $subProduct = SubProduct::find($id);

        if (!$subProduct) {
            return response()->json(['message' => 'SubProduct not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'brand' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $subProduct->update($request->all());

        return response()->json($subProduct);
    }

    public function deleteSubProduct($id)
    {
        $subProduct = SubProduct::find($id);

        if (!$subProduct) {
            return response()->json(['message' => 'SubProduct not found'], 404);
        }

        $subProduct->delete();

        return response()->json(['message' => 'SubProduct deleted successfully']);
    }

    public function storeCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $category = Category::create($request->all());

        return response()->json($category, 201);
    }

    public function getCategories()
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $category->update($request->all());

        return response()->json($category);
    }

    public function deleteCategory($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $productsCount = Product::where('category_id', $id)->count();

        if ($productsCount > 0) {
            return response()->json([
                'message' => 'Cannot delete category. There are ' . $productsCount . ' products associated with this category.'
            ], 400);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function validateOrder($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }

        $order->validation = 1;
        $order->save();

        return response()->json(['message' => 'Commande validée avec succès']);
    }

    public function getPendingOrders()
    {
        $orders = Order::with(['user', 'items.subProduct.product'])
                    ->where('validation', 0)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($orders);
    }
}

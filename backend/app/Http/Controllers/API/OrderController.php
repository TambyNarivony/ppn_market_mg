<?php

// app/Http/Controllers/API/OrderController.php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\SubProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{

    public function index()
{
    $orders = Order::with(['items.subProduct.product'])
                ->where('user_id', Auth::id())
                ->where('validation', 0) // Seulement non validées
                ->orderBy('created_at', 'desc')
                ->get();

    return response()->json($orders);
}

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.sub_product_id' => 'required|exists:sub_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'total' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Vérifier le stock
        foreach ($request->items as $item) {
            $subProduct = SubProduct::find($item['sub_product_id']);
            if ($subProduct->stock < $item['quantity']) {
                return response()->json([
                    'message' => 'Stock insuffisant pour le produit: ' . $subProduct->brand
                ], 400);
            }
        }

        // Créer la commande
        $order = Order::create([
            'user_id' => Auth::id(),
            'total' => $request->total,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
        ]);

        // Ajouter les articles à la commande
        foreach ($request->items as $item) {
            $subProduct = SubProduct::find($item['sub_product_id']);

            OrderItem::create([
                'order_id' => $order->id,
                'sub_product_id' => $item['sub_product_id'],
                'quantity' => $item['quantity'],
            ]);

            // Mettre à jour le stock
            $subProduct->stock -= $item['quantity'];
            $subProduct->save();
        }

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items')
        ], 201);
    }

    // Pour ProfilePage (toutes les commandes)
    public function getUserOrderHistory()
    {
        $orders = Order::with(['items.subProduct.product'])
                    ->where('user_id', Auth::id())
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($orders);
    }

    // Pour OrdersPage (uniquement non validées)
    public function getPendingUserOrders()
    {
        $orders = Order::with(['items.subProduct.product'])
                    ->where('user_id', Auth::id())
                    ->where('validation', 0)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json($orders);
    }
}

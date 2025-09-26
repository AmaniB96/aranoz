<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index() {
        $orders = Order::with(['cart.user', 'cart.cartProducts.product'])->get();
        
        $orders->transform(function ($order) {
            $total_quantity = 0;
            $total_amount = 0;
            
            if ($order->cart && $order->cart->cartProducts) {
                foreach ($order->cart->cartProducts as $cartProduct) {
                    $total_quantity += $cartProduct->quantity;
                    $total_amount += $cartProduct->quantity * ($cartProduct->product->price ?? 0);
                }
            }
            
            $order->total_quantity = $total_quantity;
            $order->total_amount = number_format($total_amount, 2); // Formater le montant
            return $order;
        });
        
        return Inertia::render('Admin/orders/Orders', [
            'orders' => $orders
        ]);
    }

    public function update(Request $request, $id) {
        $order = Order::findOrFail($id);

        $validatedData = $request->validate([
            'status' => ['sometimes', 'required', Rule::in(['pending', 'confirmed'])],
        ]);

        $order->update($validatedData);

        return redirect()->back()->with('success', 'Order updated successfully.');
    }
}

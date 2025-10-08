<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use App\Mail\OrderConfirmation;
use App\Mail\OrderShipped;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends controller
{
    public function index() {
        $orders = Order::with(['cart.user', 'cart.cartProducts.product', 'coupon'])->get();
        
        $orders->transform(function ($order) {
            $total_quantity = 0;
            
            if ($order->cart && $order->cart->cartProducts) {
                foreach ($order->cart->cartProducts as $cartProduct) {
                    $total_quantity += $cartProduct->quantity;
                }
            }
            
            $order->total_quantity = $total_quantity;
            // Utiliser le montant réel payé stocké en base
            $order->total_amount = number_format((float) $order->total, 2);
            $order->subtotal_amount = number_format((float) $order->subtotal, 2);
            $order->discount_amount = number_format((float) $order->discount_amount, 2);
            return $order;
        });
        
        return Inertia::render('Admin/orders/Orders', [
            'orders' => $orders
        ]);
    }

    public function update(Request $request, $id) {
        $order = Order::findOrFail($id);
        
        // Sauvegarder l'ancien statut pour vérifier le changement
        $oldStatus = $order->status;

        $validatedData = $request->validate([
            'status' => ['sometimes', 'required', Rule::in(['pending', 'confirmed'])],
        ]);

        $order->update($validatedData);

        // Si le statut passe de 'pending' à 'confirmed', envoyer l'email d'expédition
        if ($oldStatus === 'pending' && $validatedData['status'] === 'confirmed') {
            $this->sendShippingConfirmationEmail($order);
        }

        return redirect()->back()->with('success', 'Order updated successfully.');
    }

    // Public checkout method
    public function checkout(Request $request) {
        Log::info('=== CHECKOUT STARTED ===');
        
        $user = auth()->user();
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Please login to checkout');
        }
        
        Log::info('User authenticated: ' . $user->id);
        
        // Get user's active cart with products
        $cart = Cart::with('cartProducts.product.promo')
            ->where('user_id', $user->id)
            ->whereNull('ordered_at')
            ->first();
        
        Log::info('Cart found: ' . ($cart ? 'YES (ID: ' . $cart->id . ')' : 'NO'));
        
        if (!$cart || $cart->cartProducts->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }
        
        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'zip_code' => 'required|string|max:10',
            'country' => 'required|string|max:100',
        ]);
        
        DB::beginTransaction();
        
        try {
            // Calculate subtotal
            $subtotal = $cart->cartProducts->sum(function ($cartProduct) {
                $product = $cartProduct->product;
                $price = $product->price;
                
                // Apply promo if exists and active
                if ($product->promo && $product->promo->active) {
                    $price = $price * (1 - $product->promo->discount / 100);
                }
                
                return $price * $cartProduct->quantity;
            });
            
            // Get applied coupon from session
            $appliedCoupon = session('applied_coupon');
            $discount = 0;
            $couponCode = null;
            $couponId = null;
            
            if ($appliedCoupon) {
                $coupon = Coupon::find($appliedCoupon['id']);
                
                if ($coupon && $coupon->is_active && $coupon->isValid()) {
                    $couponId = $coupon->id;
                    $couponCode = $coupon->code;
                    
                    if ($coupon->type === 'percentage') {
                        $discount = ($subtotal * $coupon->value) / 100;
                    } else {
                        $discount = min($coupon->value, $subtotal);
                    }
                    
                    // Increment coupon usage
                    $coupon->increment('usage_count');
                }
            }
            
            $total = max($subtotal - $discount, 0);
            
            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'zip_code' => $validated['zip_code'],
                'country' => $validated['country'],
                'status' => 'pending',
                'date' => now(),
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'total' => $total,
                'coupon_id' => $couponId,
                'coupon_code' => $couponCode,
            ]);
            
            // Mark cart as ordered
            $cart->update(['ordered_at' => now()]);
            
            // Clear applied coupon from session
            session()->forget('applied_coupon');
            
            DB::commit();
            
            // Send confirmation email
            try {
                Mail::to($order->email)->send(new OrderConfirmation($order));
            } catch (\Exception $e) {
                Log::error('Failed to send order confirmation email: ' . $e->getMessage());
            }
            
            return redirect()->route('orders.success', $order->id);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create order. Please try again.');
        }
    }

    // Order success page
    public function success($id)
    {
        $user = Auth::user();
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['cart.cartProducts.product.promo']) // AJOUTER .promo
            ->firstOrFail();

        return Inertia::render('Orders/Success', [
            'order' => $order,
            'total' => number_format($order->total, 2),
            'subtotal' => number_format($order->subtotal, 2),
            'discount' => number_format($order->discount_amount, 2),
            'couponCode' => $order->coupon_code,
        ]);
    }

    // Order tracking - pending orders
    public function tracking() {
        $user = auth()->user();
        
        $orders = Order::where('user_id', $user->id)
            ->where('status', 'pending')
            ->with(['cart.cartProducts.product.promo'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'total' => number_format($order->total, 2), // FORMATÉ
                    'subtotal' => number_format($order->subtotal, 2), // FORMATÉ
                    'discount_amount' => number_format($order->discount_amount, 2), // FORMATÉ
                    'coupon_code' => $order->coupon_code,
                    'cart' => $order->cart,
                ];
            });
        
        return Inertia::render('Orders/Tracking', [
            'orders' => $orders
        ]);
    }

    // Order history - completed/cancelled orders
    public function history() {
        $user = auth()->user();
        
        $orders = Order::where('user_id', $user->id)
            ->where('status', 'confirmed')
            ->with(['cart.cartProducts.product.promo'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'total' => number_format($order->total, 2), // FORMATÉ
                    'subtotal' => number_format($order->subtotal, 2), // FORMATÉ
                    'discount_amount' => number_format($order->discount_amount, 2), // FORMATÉ
                    'coupon_code' => $order->coupon_code,
                    'cart' => $order->cart,
                ];
            });
    
        return Inertia::render('Orders/History', [
            'orders' => $orders
        ]);
    }

    // Show single order detail
    public function show($id) {
        $user = Auth::user();
        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with(['cart.cartProducts.product.promo']) // AJOUTER .promo
            ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'total' => number_format($order->total, 2),
            'subtotal' => number_format($order->subtotal, 2),
            'discount' => number_format($order->discount_amount, 2),
            'couponCode' => $order->coupon_code,
        ]);
    }

    /**
     * Envoyer l'email de confirmation d'expédition
     */
    private function sendShippingConfirmationEmail(Order $order)
    {
        try {
            // Récupérer les détails de la commande
            $cart = Cart::with('cartProducts.product.promo')->find($order->cart_id);
            
            if (!$cart) {
                Log::error('Cart not found for order: ' . $order->id);
                return;
            }

            $total = 0;
            $items = [];

            foreach ($cart->cartProducts as $cartProduct) {
                $product = $cartProduct->product;
                $unitPrice = $product->price;
                
                // Appliquer la promo si disponible
                if ($product->promo && $product->promo->active && isset($product->promo->discount)) {
                    $unitPrice = round($unitPrice - ($unitPrice * $product->promo->discount / 100), 2);
                }
                
                $itemTotal = $unitPrice * $cartProduct->quantity;
                $total += $itemTotal;
                
                $items[] = [
                    'name' => $product->name,
                    'quantity' => $cartProduct->quantity,
                    'unit_price' => $unitPrice,
                    'total' => $itemTotal,
                ];
            }

            // Envoyer l'email à l'utilisateur
            $userEmail = $cart->user->email;
            Mail::to($userEmail)->send(new OrderShipped($order, $items, $total));
            
            Log::info('Shipping confirmation email sent for order: ' . $order->order_number . ' to: ' . $userEmail);
            
        } catch (\Exception $e) {
            Log::error('Failed to send shipping confirmation email for order ' . $order->id . ': ' . $e->getMessage());
            // Ne pas échouer la mise à jour du statut si l'email échoue
        }
    }
}

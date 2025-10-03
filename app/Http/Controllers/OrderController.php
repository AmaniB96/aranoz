<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Mail\OrderConfirmation;
use App\Mail\OrderShipped; // Ajoutez cette ligne
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail; // Assurez-vous que cette ligne est présente
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
            $order->total_amount = number_format($total_amount, 2);
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
            Log::error('User not authenticated');
            return back()->with('error', 'Please login to checkout');
        }
        
        Log::info('User authenticated: ' . $user->id);
        
        // Get user's active cart with products
        $cart = Cart::with('cartProducts.product.promo')
            ->where('user_id', $user->id)
            ->whereNull('ordered_at')
            ->first();
        
        Log::info('Cart found: ' . ($cart ? 'YES (ID: ' . $cart->id . ')' : 'NO'));
        
        if (!$cart || $cart->cartProducts->isEmpty()) {
            Log::error('Cart is empty or not found');
            return back()->with('error', 'Your cart is empty.');
        }
        
        DB::beginTransaction();
        
        try {
            // Calculate total
            $total = 0;
            $items = []; // Préparer les items pour l'email
            
            foreach ($cart->cartProducts as $cartProduct) {
                $product = $cartProduct->product;
                $unitPrice = $product->price;
                
                // Apply promo if available
                if ($product->promo && $product->promo->active && isset($product->promo->discount)) {
                    $unitPrice = round($unitPrice - ($unitPrice * $product->promo->discount / 100), 2);
                }
                
                $itemTotal = $unitPrice * $cartProduct->quantity;
                $total += $itemTotal;
                
                // Préparer les données pour l'email
                $items[] = [
                    'name' => $product->name,
                    'quantity' => $cartProduct->quantity,
                    'unit_price' => $unitPrice,
                    'total' => $itemTotal,
                ];
            }
            
            Log::info('Total calculated: ' . $total);
            
            // Generate unique order number
            $orderNumber = 'ORD-' . strtoupper(uniqid());
            
            Log::info('Order number generated: ' . $orderNumber);
            
            // Create order with all required fields
            $orderData = [
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'date' => now(),
            ];
            
            Log::info('Creating order with data: ' . json_encode($orderData));
            
            $order = Order::create($orderData);
            
            Log::info('Order created successfully with ID: ' . $order->id);
            
            // Mark cart as ordered
            $cart->update(['ordered_at' => now()]);
            
            Log::info('Cart marked as ordered - products kept for history');
            
            // CRÉER UN NOUVEAU PANIER VIDE pour les futurs achats
            Cart::create([
                'user_id' => $user->id,
                'ordered_at' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            Log::info('New empty cart created for future purchases');
            
            // ENVOYER L'EMAIL DE CONFIRMATION
            try {
                Mail::to($user->email)->send(new OrderConfirmation($order, $items, $total));
                Log::info('Order confirmation email sent to: ' . $user->email);
            } catch (\Exception $emailException) {
                Log::error('Failed to send order confirmation email: ' . $emailException->getMessage());
                // Ne pas échouer la commande si l'email échoue
            }
            
            DB::commit();
            
            Log::info('Transaction committed successfully');
            
            // Force redirect to success page
            $successUrl = route('orders.success', $order->id);
            Log::info('Redirecting to: ' . $successUrl);
            
            return redirect($successUrl)->with('success', 'Order placed successfully!');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('=== CHECKOUT FAILED ===');
            Log::error('Error message: ' . $e->getMessage());
            Log::error('Error file: ' . $e->getFile() . ':' . $e->getLine());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            // Return to cart with error
            return back()->with('error', 'Failed to create order: ' . $e->getMessage());
        }
    }

    // Order success page
    public function success($id) {
        Log::info('Success page accessed for order: ' . $id);
        
        $order = Order::with(['cart.cartProducts.product.promo', 'user'])
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $total = 0;
        $items = [];
        
        foreach ($order->cart->cartProducts as $cartProduct) {
            $product = $cartProduct->product;
            $unitPrice = $product->price;
            
            if ($product->promo && $product->promo->active && isset($product->promo->discount)) {
                $unitPrice = round($unitPrice - ($unitPrice * $product->promo->discount / 100), 2);
            }
            
            $total += $unitPrice * $cartProduct->quantity;
            
            $items[] = [
                'id' => $cartProduct->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'quantity' => $cartProduct->quantity,
                'unit_price' => $unitPrice,
                'total' => $unitPrice * $cartProduct->quantity,
                'image' => $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png'
            ];
        }
        
        Log::info('Rendering success page with order: ' . $order->id);
        
        return Inertia::render('Orders/Success', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'date' => $order->date,
                'items' => $items
            ],
            'total' => number_format($total, 2)
        ]);
    }

    // Order tracking - pending orders
    public function tracking() {
        $user = auth()->user();
        
        $orders = Order::with(['cart.cartProducts.product'])
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->latest()
            ->get();
        
        Log::info('Tracking orders loaded: ' . $orders->count());
        Log::info('First order cart products: ' . ($orders->first()?->cart?->cartProducts?->count() ?? 'null'));
        
        // Calculate totals for each order
        $orders->transform(function ($order) {
            $total = 0;
            if ($order->cart && $order->cart->cartProducts) {
                foreach ($order->cart->cartProducts as $cartProduct) {
                    $total += $cartProduct->quantity * ($cartProduct->product->price ?? 0);
                }
            }
            $order->total = number_format($total, 2);
            return $order;
        });
        
        return Inertia::render('Orders/Tracking', [
            'orders' => $orders
        ]);
    }

    // Order history - completed/cancelled orders
    public function history() {
        $user = auth()->user();
        
        $orders = Order::with(['cart.cartProducts.product'])
            ->where('user_id', $user->id)
            ->where('status', 'confirmed')
            ->latest()
            ->get();
        
        Log::info('History orders loaded: ' . $orders->count());
        
        // Calculate totals for each order
        $orders->transform(function ($order) {
            $total = 0;
            if ($order->cart && $order->cart->cartProducts) {
                foreach ($order->cart->cartProducts as $cartProduct) {
                    $total += $cartProduct->quantity * ($cartProduct->product->price ?? 0);
                }
            }
            $order->total = number_format($total, 2);
            return $order;
        });
        
        return Inertia::render('Orders/History', [
            'orders' => $orders
        ]);
    }

    // Show single order detail
    public function show($id) {
        $order = Order::with(['cart.cartProducts.product', 'user'])
            ->where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $total = 0;
        if ($order->cart && $order->cart->cartProducts) {
            foreach ($order->cart->cartProducts as $cartProduct) {
                $total += $cartProduct->quantity * ($cartProduct->product->price ?? 0);
            }
        }
        
        return Inertia::render('Orders/Show', [
            'order' => $order,
            'total' => $total // Passez le nombre brut, pas formaté
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

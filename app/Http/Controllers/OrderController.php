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

    /**
     * Afficher la page de checkout
     */
    public function checkoutPage(Request $request)
    {
        $user = Auth::user();
        
        // Récupérer le panier actuel
        $cart = Cart::with(['cartProducts.product.promo'])
            ->where('user_id', $user->id)
            ->whereNull('ordered_at')
            ->first();

        if (!$cart || $cart->cartProducts->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        $items = [];
        $subtotal = 0;

        foreach ($cart->cartProducts as $cp) {
            $product = $cp->product;
            $unitPrice = $product->price;
            
            // Appliquer les promos
            if ($product->promo && ($product->promo->active ?? false) && isset($product->promo->discount)) {
                $unitPrice = round($unitPrice - ($unitPrice * $product->promo->discount / 100), 2);
            }
            
            $total = round($unitPrice * $cp->quantity, 2);
            $subtotal += $total;

            $items[] = [
                'id' => $cp->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'image' => $product->image_front ? "/storage/products/card/{$product->image_front}" : '/public/images/placeholder.png',
                'unit_price' => $unitPrice,
                'quantity' => $cp->quantity,
                'total' => $total,
            ];
        }

        // Récupérer le coupon appliqué
        $appliedCoupon = Session::get('applied_coupon');
        $discount = 0;

        if ($appliedCoupon && $subtotal > 0) {
            if ($appliedCoupon['type'] === 'percentage') {
                $discount = ($subtotal * $appliedCoupon['value']) / 100;
            } elseif ($appliedCoupon['type'] === 'fixed') {
                $discount = min($appliedCoupon['value'], $subtotal);
            }
        }

        $total = max(0, $subtotal - $discount);

        // PRÉ-REMPLIR AVEC LES INFOS UTILISATEUR
        $userInfo = [
            'firstname' => $user->name ? explode(' ', $user->name)[0] : '',
            'lastname' => $user->name && count(explode(' ', $user->name)) > 1 ? 
                         implode(' ', array_slice(explode(' ', $user->name), 1)) : '',
            'email' => $user->email ?? '',
            'company' => '',
            'phone' => $user->phone ?? '',
            'country' => 'Belgium',
            'address' => $user->address ?? '',
            'number' => '',
            'city' => $user->city ?? '',
            'postcode' => $user->zip_code ?? ''
        ];

        return Inertia::render('Checkout/Checkout', [
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'total' => round($total, 2),
            'appliedCoupon' => $appliedCoupon,
            'userInfo' => $userInfo,
        ]);
    }

    /**
     * Simuler le paiement et créer la commande
     */
    public function simulatePayment(Request $request)
    {
        $user = Auth::user();
        
        $validatedData = $request->validate([
            'billing.firstname' => 'required|string|max:255',
            'billing.lastname' => 'required|string|max:255',
            'billing.email' => 'required|email|max:255',
            'billing.address' => 'required|string|max:255',
            'billing.city' => 'required|string|max:255',
            'billing.postcode' => 'required|string|max:20',
            'billing.country' => 'required|string|max:255',
            'billing.company' => 'nullable|string|max:255',
            'billing.phone' => 'nullable|string|max:50',
            'billing.number' => 'nullable|string|max:20',
            'payment_method' => 'required|in:check,paypal',
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'coupon_code' => 'nullable|string|max:50',
            // AJOUTER LA VALIDATION DES ITEMS
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        // Récupérer le panier actuel
        $cart = Cart::with('cartProducts.product.promo')
            ->where('user_id', $user->id)
            ->whereNull('ordered_at')
            ->first();

        if (!$cart || $cart->cartProducts->isEmpty()) {
            return back()->with('error', 'Cart is empty');
        }

        DB::beginTransaction();

        try {
            // GÉNÉRER UN NUMÉRO DE COMMANDE STRUCTURÉ
            $orderNumber = $this->generateOrderNumber();

            // Créer la commande
            $order = Order::create([
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'total' => $validatedData['total'],
                'subtotal' => $validatedData['subtotal'],
                'discount_amount' => $validatedData['discount'] ?? 0,
                'coupon_code' => $validatedData['coupon_code'],
                'payment_method' => $validatedData['payment_method'],
                
                // Informations de facturation
                'name' => $validatedData['billing']['firstname'] . ' ' . $validatedData['billing']['lastname'],
                'email' => $validatedData['billing']['email'],
                'address' => $validatedData['billing']['address'] . 
                            ($validatedData['billing']['number'] ? ' ' . $validatedData['billing']['number'] : ''),
                'city' => $validatedData['billing']['city'],
                'zip_code' => $validatedData['billing']['postcode'],
                'country' => $validatedData['billing']['country'],
                'phone' => $validatedData['billing']['phone'] ?? null,
                
                'date' => now(),
            ]);

            // Marquer le panier comme commandé
            $cart->update(['ordered_at' => now()]);

            // Supprimer le coupon de la session
            Session::forget('applied_coupon');

            // UTILISER LES ITEMS DU FORMULAIRE AU LIEU DE RECALCULER
            $items = $validatedData['items'];

            // CRÉER UN NOUVEAU PANIER VIDE pour les futurs achats
            Cart::create([
                'user_id' => $user->id,
                'ordered_at' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            DB::commit();

            // Envoyer l'email de confirmation AVEC LES DONNÉES VALIDÉES
            try {
                Mail::to($validatedData['billing']['email'])->send(new OrderConfirmation(
                    $order,
                    $items,
                    $validatedData['total'],
                    $validatedData['subtotal'],
                    $validatedData['discount'] ?? 0,
                    $validatedData['coupon_code']
                ));
                Log::info('Order confirmation email sent to: ' . $validatedData['billing']['email']);
            } catch (\Exception $e) {
                Log::error('Failed to send order confirmation email: ' . $e->getMessage());
            }

            // Redirection vers la page de succès
            return redirect()->route('orders.success', $order->id);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            
            return back()->with('error', 'Order creation failed: ' . $e->getMessage());
        }
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
            // Calculate subtotal (before any discounts)
            $subtotal = 0;
            $items = []; // Préparer les items pour l'email
            
            foreach ($cart->cartProducts as $cartProduct) {
                $product = $cartProduct->product;
                $unitPrice = $product->price;
                
                // Apply promo if available
                if ($product->promo && $product->promo->active && isset($product->promo->discount)) {
                    $unitPrice = round($unitPrice - ($unitPrice * $product->promo->discount / 100), 2);
                }
                
                $itemTotal = $unitPrice * $cartProduct->quantity;
                $subtotal += $itemTotal;
                
                // Préparer les données pour l'email
                $items[] = [
                    'name' => $product->name,
                    'quantity' => $cartProduct->quantity,
                    'unit_price' => $unitPrice,
                    'total' => $itemTotal,
                ];
            }
            
            Log::info('Subtotal calculated: ' . $subtotal);
            
            // Check for applied coupon from session
            $appliedCoupon = session('applied_coupon');
            $coupon = null;
            $discountAmount = 0;
            $finalTotal = $subtotal;
            
            if ($appliedCoupon) {
                $coupon = Coupon::find($appliedCoupon['id']);
                if ($coupon && $coupon->isValid($subtotal)) {
                    // Calculate discount
                    if ($appliedCoupon['type'] === 'percentage') {
                        $discountAmount = round($subtotal * ($appliedCoupon['value'] / 100), 2);
                    } elseif ($appliedCoupon['type'] === 'fixed') {
                        $discountAmount = min($appliedCoupon['value'], $subtotal);
                    }
                    
                    $finalTotal = max(0, $subtotal - $discountAmount);
                    
                    Log::info('Coupon applied: ' . $appliedCoupon['code'] . ' - Discount: $' . $discountAmount . ' - Final total: $' . $finalTotal);
                    
                    // Increment coupon usage
                    $coupon->increment('usage_count');
                } else {
                    Log::warning('Applied coupon is no longer valid: ' . ($appliedCoupon['code'] ?? 'unknown'));
                    $appliedCoupon = null;
                }
            }
            
            $total = $finalTotal; // Pour compatibilité avec le code existant
            Log::info('Final total calculated: ' . $total);
            
            // GÉNÉRER UN NUMÉRO DE COMMANDE STRUCTURÉ
            $orderNumber = $this->generateOrderNumber();
            
            Log::info('Order number generated: ' . $orderNumber);
            
            // Create order with all required fields
            $orderData = [
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'order_number' => $orderNumber,
                'status' => 'pending',
                'date' => now(),
                'coupon_id' => $coupon ? $coupon->id : null,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total' => $finalTotal,
                'coupon_code' => $appliedCoupon ? $appliedCoupon['code'] : null,
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
                Mail::to($user->email)->send(new OrderConfirmation(
                    $order, 
                    $items, 
                    number_format((float) $finalTotal, 2),
                    number_format((float) $subtotal, 2),
                    number_format((float) $discountAmount, 2),
                    $appliedCoupon ? $appliedCoupon['code'] : null
                ));
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
            ->with(['cart.cartProducts.product'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'total' => number_format($order->total, 2), // MONTANT FINAL PAYÉ
                    'subtotal' => number_format($order->subtotal, 2), // MONTANT AVANT RÉDUCTION
                    'discount' => number_format($order->discount_amount, 2), // MONTANT DE LA RÉDUCTION
                    'coupon_code' => $order->coupon_code, // CODE DU COUPON UTILISÉ
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
            ->with(['cart.cartProducts.product.promo']) // AJOUTER .promo
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->created_at,
                    'status' => $order->status,
                    'total' => number_format($order->total, 2), // MONTANT FINAL PAYÉ
                    'subtotal' => number_format($order->subtotal, 2), // MONTANT AVANT RÉDUCTION
                    'discount' => number_format($order->discount_amount, 2), // MONTANT DE LA RÉDUCTION
                    'coupon_code' => $order->coupon_code, // CODE DU COUPON UTILISÉ
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


    private function generateOrderNumber()
    {
        $lastOrder = Order::orderBy('id', 'desc')->first();
        $nextNumber = $lastOrder ? $lastOrder->id + 1 : 1;
        
        $prefix = 'ARAZ';
        $type = 'ORD';
        $date = date('Ymd'); // Format: 20251008
        $randomCode = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 2));
        $sequentialNumber = str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
        
        return "{$prefix}-{$type}-{$date}-{$randomCode}-{$sequentialNumber}";
    }
}

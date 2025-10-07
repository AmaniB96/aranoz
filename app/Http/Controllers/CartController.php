<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CartController extends Controller
{
    // show user's cart (requires auth middleware in route)
    public function index(Request $request)
    {
        $user = $request->user();
        
        // CORRECTION: Récupérer seulement le panier actif (non commandé)
        $cart = Cart::with(['cartProducts.product.promo', 'cartProducts.product.productCategory'])
            ->where('user_id', $user->id)
            ->whereNull('ordered_at')  // Seulement les paniers non commandés
            ->first();

        $items = [];
        $subtotal = 0;

        if ($cart) {
            foreach ($cart->cartProducts as $cp) {
                $product = $cp->product;
                $unitPrice = $product->price;
                $discounted = null;
                if ($product->promo && ($product->promo->active ?? false) && isset($product->promo->discount)) {
                    $discounted = round($unitPrice - ($unitPrice * $product->promo->discount / 100), 2);
                    $unitPrice = $discounted;
                }
                $total = round($unitPrice * $cp->quantity, 2);
                $subtotal += $total;

                $items[] = [
                    'id' => $cp->id,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png',
                    'unit_price' => $unitPrice,
                    'original_price' => $product->price,
                    'discounted_price' => $discounted,
                    'quantity' => $cp->quantity,
                    'total' => $total,
                ];
            }
        }

        // AJOUT : Récupérer le coupon appliqué depuis la session
        $appliedCoupon = Session::get('applied_coupon');

        return Inertia::render('Cart/Index', [
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'appliedCoupon' => $appliedCoupon, // AJOUT
        ]);
    }

    // add product to cart (auth only)
    public function add(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty' => 'nullable|integer|min:1',
        ]);

        $qty = $data['qty'] ?? 1;

        // CORRECTION: Chercher/créer seulement les paniers NON commandés
        $cart = Cart::firstOrCreate([
            'user_id' => $user->id,
            'ordered_at' => null  // Seulement les paniers non commandés
        ]);

        $cartProduct = $cart->cartProducts()->where('product_id', $data['product_id'])->first();

        if ($cartProduct) {
            $cartProduct->quantity = $cartProduct->quantity + $qty;
            $cartProduct->save();
        } else {
            $cart->cartProducts()->create([
                'product_id' => $data['product_id'],
                'quantity' => $qty,
            ]);
        }

        // compute cartCount (sum quantities) - seulement paniers actifs
        $cartCount = $cart->cartProducts()->sum('quantity');

        return response()->json([
            'success' => true,
            'cartCount' => (int) $cartCount,
        ]);
    }

    // update quantity (optional helper)
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cp = CartProduct::findOrFail($id);
        // ensure this cart product belongs to the user's cart
        if ($cp->cart->user_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $cp->quantity = $data['quantity'];
        $cp->save();

        return response()->json(['success' => true]);
    }

    // remove cart product
    public function remove(Request $request, $id)
    {
        $user = $request->user();
        $cp = CartProduct::findOrFail($id);

        // ensure this cart product belongs to the user's cart AND is not ordered
        if ($cp->cart->user_id !== $user->id || $cp->cart->ordered_at !== null) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // capture product name for client toast
        $productName = $cp->product->name ?? null;

        $cp->delete();

        // recompute cart count - seulement paniers actifs
        $cart = Cart::where('user_id', $user->id)->whereNull('ordered_at')->first();
        $cartCount = $cart ? (int) $cart->cartProducts()->sum('quantity') : 0;

        return response()->json([
            'success' => true,
            'cartCount' => $cartCount,
            'removedName' => $productName,
        ]);
    }

    // NOUVELLES MÉTHODES POUR LES COUPONS
    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50',
        ]);

        $user = Auth::user();
        $code = strtoupper(trim($request->code));

        // Vérifier si le coupon existe et est valide
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired coupon code',
            ], 400);
        }

        // Calculer le subtotal actuel pour vérifier le montant minimum
        $cart = Cart::where('user_id', $user->id)->whereNull('ordered_at')->first();
        $subtotal = 0;
        
        if ($cart) {
            foreach ($cart->cartProducts as $cp) {
                $product = $cp->product;
                $unitPrice = $product->price;
                if ($product->promo && ($product->promo->active ?? false) && isset($product->promo->discount)) {
                    $unitPrice = round($unitPrice - ($unitPrice * $product->promo->discount / 100), 2);
                }
                $subtotal += round($unitPrice * $cp->quantity, 2);
            }
        }

        // Vérifier le montant minimum d'achat
        if ($coupon->min_purchase_amount && $subtotal < $coupon->min_purchase_amount) {
            return response()->json([
                'success' => false,
                'message' => 'Minimum purchase amount of $' . $coupon->min_purchase_amount . ' required.',
            ], 400);
        }

        // Déterminer le type et la valeur du coupon
        $type = null;
        $value = null;
        
        if ($coupon->discount_percentage) {
            $type = 'percentage';
            $value = $coupon->discount_percentage;
        } elseif ($coupon->discount_amount) {
            $type = 'fixed';
            $value = $coupon->discount_amount;
        }

        if (!$type || !$value) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid coupon configuration',
            ], 400);
        }

        // Stocker le coupon dans la session
        Session::put('applied_coupon', [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'type' => $type,
            'value' => $value,
            'category_id' => null, // Pour compatibilité
        ]);

        return response()->json([
            'success' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $type,
                'value' => $value,
                'category_id' => null,
            ],
        ]);
    }

    public function removeCoupon(Request $request)
    {
        Session::forget('applied_coupon');

        return response()->json([
            'success' => true,
        ]);
    }
}

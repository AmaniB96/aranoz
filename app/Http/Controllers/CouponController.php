<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/coupons/Coupon', [
            'coupons' => $coupons
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::all();

        return Inertia::render('Admin/coupons/CouponEdit', [
            'coupon' => null,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after:today',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array',
            'applicable_categories.*' => 'exists:product_categories,id',
        ]);

        // Validation : soit pourcentage soit montant fixe
        if (empty($validatedData['discount_percentage']) && empty($validatedData['discount_amount'])) {
            return back()->withErrors(['discount' => 'Either discount percentage or discount amount must be provided.']);
        }

        if (!empty($validatedData['discount_percentage']) && !empty($validatedData['discount_amount'])) {
            return back()->withErrors(['discount' => 'Please provide either discount percentage OR discount amount, not both.']);
        }

        $coupon = Coupon::create($validatedData);

        return redirect()->route('coupons.index')->with('success', 'Coupon created successfully.');
    }

    public function show($id)
    {
        $coupon = Coupon::findOrFail($id);

        return Inertia::render('Admin/coupons/CouponShow', [
            'coupon' => $coupon
        ]);
    }

    public function edit($id)
    {
        $coupon = Coupon::findOrFail($id);
        $categories = ProductCategory::all();

        return Inertia::render('Admin/coupons/CouponEdit', [
            'coupon' => $coupon,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validatedData = $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('coupons')->ignore($coupon->id)],
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
            'applicable_categories' => 'nullable|array',
            'applicable_categories.*' => 'exists:product_categories,id',
        ]);

        // Validation : soit pourcentage soit montant fixe
        if (empty($validatedData['discount_percentage']) && empty($validatedData['discount_amount'])) {
            return back()->withErrors(['discount' => 'Either discount percentage or discount amount must be provided.']);
        }

        if (!empty($validatedData['discount_percentage']) && !empty($validatedData['discount_amount'])) {
            return back()->withErrors(['discount' => 'Please provide either discount percentage OR discount amount, not both.']);
        }

        $coupon->update($validatedData);

        return redirect()->route('coupons.index')->with('success', 'Coupon updated successfully.');
    }

    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return redirect()->route('coupons.index')->with('success', 'Coupon deleted successfully.');
    }

    /**
     * API endpoint pour valider un coupon
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'total_amount' => 'required|numeric|min:0'
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Coupon code not found.'
            ]);
        }

        if (!$coupon->isValid($request->total_amount)) {
            $message = 'Coupon is not valid.';

            if (!$coupon->is_active) {
                $message = 'This coupon is not active.';
            } elseif ($coupon->expires_at && $coupon->expires_at->isPast()) {
                $message = 'This coupon has expired.';
            } elseif ($coupon->usage_limit && $coupon->usage_count >= $coupon->usage_limit) {
                $message = 'This coupon has reached its usage limit.';
            } elseif ($coupon->min_purchase_amount && $request->total_amount < $coupon->min_purchase_amount) {
                $message = 'Minimum purchase amount of $' . $coupon->min_purchase_amount . ' required.';
            }

            return response()->json([
                'valid' => false,
                'message' => $message
            ]);
        }

        $discount = $coupon->calculateDiscount($request->total_amount);

        return response()->json([
            'valid' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'name' => $coupon->name,
                'discount' => $discount,
                'discount_percentage' => $coupon->discount_percentage,
                'discount_amount' => $coupon->discount_amount,
            ],
            'message' => 'Coupon applied successfully!'
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Color;
use App\Models\Promo;
use App\Models\ProductDetail;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index() {
        $products = Product::with(['productCategory', 'color', 'promo', 'productDetail'])->get();

        return Inertia::render('Admin/products/Product', [
            'products' => $products
        ]);
    }

    public function show($id) {
        $product = Product::with(['productCategory', 'color', 'promo', 'productDetail', 'cartProducts', 'likedByUsers'])->findOrFail($id);

        return Inertia::render('Admin/products/ProductShow', [
            'product' => $product
        ]);
    }

    public function create() {
        $categories = ProductCategory::all();
        $colors = Color::all();
        $promos = Promo::all();

        return Inertia::render('Admin/products/ProductEdit', [
            'product' => null,
            'categories' => $categories,
            'colors' => $colors,
            'promos' => $promos
        ]);
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image_front' => 'nullable|string|max:255',
            'image_left' => 'nullable|string|max:255',
            'image_right' => 'nullable|string|max:255',
            'image_bonus' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'isPinned' => 'boolean',
            'available' => 'boolean',
            'product_category_id' => 'required|exists:product_categories,id',
            'color_id' => 'required|exists:colors,id',
            'promo_id' => 'nullable|exists:promos,id',
            // ProductDetail fields
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'depth' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'quality_checking' => 'boolean',
            'freshness_duration' => 'nullable|string|max:255',
            'packaging_date' => 'nullable|date',
            'box_content' => 'nullable|string'
        ]);

        $productData = collect($validatedData)->except(['width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content'])->toArray();
        $productDetailData = collect($validatedData)->only(['width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content'])->toArray();

        $product = Product::create($productData);

        if (!empty(array_filter($productDetailData))) {
            $productDetailData['product_id'] = $product->id;
            ProductDetail::create($productDetailData);
        }

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit($id) {
        $product = Product::with('productDetail')->findOrFail($id);
        $categories = ProductCategory::all();
        $colors = Color::all();
        $promos = Promo::all();

        return Inertia::render('Admin/products/ProductEdit', [
            'product' => $product,
            'categories' => $categories,
            'colors' => $colors,
            'promos' => $promos
        ]);
    }

    public function update(Request $request, $id) {
        $product = Product::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image_front' => 'nullable|string|max:255',
            'image_left' => 'nullable|string|max:255',
            'image_right' => 'nullable|string|max:255',
            'image_bonus' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'isPinned' => 'boolean',
            'available' => 'boolean',
            'product_category_id' => 'required|exists:product_categories,id',
            'color_id' => 'required|exists:colors,id',
            'promo_id' => 'nullable|exists:promos,id',
            // ProductDetail fields
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'depth' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'quality_checking' => 'boolean',
            'freshness_duration' => 'nullable|string|max:255',
            'packaging_date' => 'nullable|date',
            'box_content' => 'nullable|string'
        ]);

        $productData = collect($validatedData)->except(['width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content'])->toArray();
        $productDetailData = collect($validatedData)->only(['width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content'])->toArray();

        $product->update($productData);

        if ($product->productDetail) {
            if (!empty(array_filter($productDetailData))) {
                $product->productDetail->update($productDetailData);
            } else {
                $product->productDetail->delete();
            }
        } elseif (!empty(array_filter($productDetailData))) {
            $productDetailData['product_id'] = $product->id;
            ProductDetail::create($productDetailData);
        }

        return redirect()->route('products.show', $product->id)->with('success', 'Product updated successfully.');
    }

    public function destroy($id) {
        Product::findOrFail($id)->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}

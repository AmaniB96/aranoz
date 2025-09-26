<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Color;
use App\Models\Promo;
use App\Models\ProductDetail;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    private ImageService $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }
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
            'image_front' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_front_url' => 'nullable|string|url',
            'image_left' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_left_url' => 'nullable|string|url',
            'image_right' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_right_url' => 'nullable|string|url',
            'image_bonus' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_bonus_url' => 'nullable|string|url',
            'stock' => 'required|integer|min:0',
            'isPinned' => 'boolean',
            'available' => 'boolean',
            'product_category_id' => 'required|exists:product_categories,id',
            'color_id' => 'required|exists:colors,id',
            'promo_id' => 'nullable|exists:promos,id',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'depth' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'quality_checking' => 'boolean',
            'freshness_duration' => 'nullable|string|max:255',
            'packaging_date' => 'nullable|date',
            'box_content' => 'nullable|string'
        ]);

        // Prepare image data for processing
        $imageData = [
            'front' => $request->file('image_front') ?: $request->input('image_front_url'),
            'left' => $request->file('image_left') ?: $request->input('image_left_url'),
            'right' => $request->file('image_right') ?: $request->input('image_right_url'),
            'bonus' => $request->file('image_bonus') ?: $request->input('image_bonus_url'),
        ];

        // Process images
        $processedImages = $this->imageService->processProductImages($imageData);

        $productData = collect($validatedData)->except([
            'width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content',
            'image_front', 'image_front_url', 'image_left', 'image_left_url', 'image_right', 'image_right_url', 'image_bonus', 'image_bonus_url'
        ])->merge($processedImages)->toArray();

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
            'image_front' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_front_url' => 'nullable|string|url',
            'image_left' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_left_url' => 'nullable|string|url',
            'image_right' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_right_url' => 'nullable|string|url',
            'image_bonus' => 'nullable|file|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_bonus_url' => 'nullable|string|url',
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

        // Prepare image data for processing
        $imageData = [
            'front' => $request->file('image_front') ?: $request->input('image_front_url'),
            'left' => $request->file('image_left') ?: $request->input('image_left_url'),
            'right' => $request->file('image_right') ?: $request->input('image_right_url'),
            'bonus' => $request->file('image_bonus') ?: $request->input('image_bonus_url'),
        ];

        // Process images (pass existing image name for updates)
        $processedImages = $this->imageService->processProductImages($imageData, $product->image_front);

        $productData = collect($validatedData)->except([
            'width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content',
            'image_front', 'image_front_url', 'image_left', 'image_left_url', 'image_right', 'image_right_url', 'image_bonus', 'image_bonus_url'
        ])->merge($processedImages)->toArray();

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
        $product = Product::findOrFail($id);

        // Delete associated images
        if ($product->image_front) {
            $this->imageService->deleteProductImages($product->image_front);
        }

        $product->delete();
        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}

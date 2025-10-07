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
use Illuminate\Support\Facades\Auth;

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

        // CORRECTION : Traitement spécial pour les champs vides
        $processedData = [];
        foreach ($validatedData as $key => $value) {
            // Convertir les chaînes vides en null pour certains champs
            if (in_array($key, ['width', 'height', 'depth', 'weight', 'freshness_duration', 'packaging_date', 'box_content', 'promo_id'])) {
                $processedData[$key] = ($value === '' || $value === null) ? null : $value;
            } else {
                $processedData[$key] = $value;
            }
        }

        // Prepare image data for processing
        $imageData = [
            'front' => $request->file('image_front') ?: $request->input('image_front_url'),
            'left' => $request->file('image_left') ?: $request->input('image_left_url'),
            'right' => $request->file('image_right') ?: $request->input('image_right_url'),
            'bonus' => $request->file('image_bonus') ?: $request->input('image_bonus_url'),
        ];

        // Process images
        $processedImages = $this->imageService->processProductImages($imageData);

        $productData = collect($processedData)->except([
            'width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content',
            'image_front', 'image_front_url', 'image_left', 'image_left_url', 'image_right', 'image_right_url', 'image_bonus', 'image_bonus_url'
        ])->merge($processedImages)->toArray();

        $productDetailData = collect($processedData)->only(['width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content'])->toArray();

        $product = Product::create($productData);

        if (!empty(array_filter($productDetailData))) {
            $productDetailData['product_id'] = $product->id;
            ProductDetail::create($productDetailData);
        }

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit($id) {
        $product = Product::with(['productDetail', 'productCategory', 'color', 'promo'])->findOrFail($id); // AJOUT : toutes les relations
        $categories = ProductCategory::all();
        $colors = Color::all();
        $promos = Promo::all();

        // Préparer les données du produit pour le frontend
        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'stock' => $product->stock,
            'isPinned' => $product->isPinned,
            'available' => $product->available,
            'product_category_id' => $product->product_category_id,
            'color_id' => $product->color_id,
            'promo_id' => $product->promo_id,
            // Images avec chemins complets
            'image_front' => $product->image_front,
            'image_left' => $product->image_left,
            'image_right' => $product->image_right,
            'image_bonus' => $product->image_bonus,
            // Détails produit
            'productDetail' => $product->productDetail ? [
                'width' => $product->productDetail->width,
                'height' => $product->productDetail->height,
                'depth' => $product->productDetail->depth,
                'weight' => $product->productDetail->weight,
                'quality_checking' => $product->productDetail->quality_checking,
                'freshness_duration' => $product->productDetail->freshness_duration,
                'packaging_date' => $product->productDetail->packaging_date,
                'box_content' => $product->productDetail->box_content,
            ] : null,
        ];

        return Inertia::render('Admin/products/ProductEdit', [
            'product' => $productData, // DONNÉES FORMATÉES
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
            // ProductDetail fields - CORRECTION : Accepter null ou string
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'depth' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'quality_checking' => 'boolean',
            'freshness_duration' => 'nullable|string|max:255', // CORRECTION : permettre null ou string vide
            'packaging_date' => 'nullable|date',
            'box_content' => 'nullable|string'
        ]);

        // CORRECTION : Traitement spécial pour les champs vides
        $processedData = [];
        foreach ($validatedData as $key => $value) {
            // Convertir les chaînes vides en null pour certains champs
            if (in_array($key, ['width', 'height', 'depth', 'weight', 'freshness_duration', 'packaging_date', 'box_content', 'promo_id'])) {
                $processedData[$key] = ($value === '' || $value === null) ? null : $value;
            } else {
                $processedData[$key] = $value;
            }
        }

        // Prepare image data for processing
        $imageData = [
            'front' => $request->file('image_front') ?: $request->input('image_front_url'),
            'left' => $request->file('image_left') ?: $request->input('image_left_url'),
            'right' => $request->file('image_right') ?: $request->input('image_right_url'),
            'bonus' => $request->file('image_bonus') ?: $request->input('image_bonus_url'),
        ];

        // Process images (pass existing image name for updates)
        $processedImages = $this->imageService->processProductImages($imageData, $product->image_front);

        $productData = collect($processedData)->except([
            'width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content',
            'image_front', 'image_front_url', 'image_left', 'image_left_url', 'image_right', 'image_right_url', 'image_bonus', 'image_bonus_url'
        ])->merge($processedImages)->toArray();

        $productDetailData = collect($processedData)->only(['width', 'height', 'depth', 'weight', 'quality_checking', 'freshness_duration', 'packaging_date', 'box_content'])->toArray();

        $product->update($productData);

        // Vérifier si au moins un champ productDetail a une valeur
        $hasProductDetails = collect($productDetailData)->contains(function ($value, $key) {
            // Pour les booléens, false est une valeur valide
            if ($key === 'quality_checking') {
                return true; // Toujours considérer comme ayant une valeur
            }
            // Pour les autres champs, vérifier qu'ils ne sont pas null/vide
            return $value !== null && $value !== '';
        });

        if ($product->productDetail) {
            if ($hasProductDetails) {
                $product->productDetail->update($productDetailData);
            } else {
                $product->productDetail->delete();
            }
        } elseif ($hasProductDetails) {
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

    public function togglePin($id) {
        $product = Product::findOrFail($id);
        $product->isPinned = !$product->isPinned;
        $product->save();

        return redirect()->back()->with('success', 'Product pin status updated successfully.');
    }

    public function showPublic($id) {
        $user = Auth::user();
        $product = Product::with(['productCategory', 'color', 'promo', 'productDetail'])
            ->findOrFail($id);

        // Ajouter les URLs des images
        $product->image_url = $product->image_front ? "/storage/products/show/{$product->image_front}" : null;
        $product->gallery = array_filter([
            $product->image_front ? "/storage/products/show/{$product->image_front}" : null,
            $product->image_left ? "/storage/products/show/{$product->image_left}" : null,
            $product->image_right ? "/storage/products/show/{$product->image_right}" : null,
            $product->image_bonus ? "/storage/products/show/{$product->image_bonus}" : null,
        ]);

        // Add liked status for current user
        $product->is_liked_by_user = $user ? $product->likedByUsers()->where('user_id', $user->id)->exists() : false;
        $product->liked_by_users_count = $product->likedByUsers()->count();

        // Calculer les propriétés de promo pour ProductInfo
        if ($product->promo && $product->promo->active && $product->promo->discount) {
            $product->discounted_price = round($product->price * (1 - $product->promo->discount / 100), 2);
            $product->discount_percent = $product->promo->discount;
        }

        // Récupérer les best sellers (produits les plus populaires ou épinglés)
        $bestSellers = Product::with(['promo'])
            ->where('available', true)
            ->where('id', '!=', $id) // Exclure le produit actuel
            ->orderBy('isPinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function ($product) use ($user) {
                $data = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'image_front' => $product->image_front,
                    'image_url' => $product->image_front ? "/storage/products/card/{$product->image_front}" : '/storage/products/default.png',
                    'is_liked_by_user' => $user ? $product->likedByUsers()->where('user_id', $user->id)->exists() : false,
                    'liked_by_users_count' => $product->likedByUsers()->count(),
                ];

                // Calcul uniforme des promos pour BestSellers
                if ($product->promo && $product->promo->active && $product->promo->discount) {
                    $data['discounted_price'] = round($product->price * (1 - $product->promo->discount / 100), 2);
                    $data['discount_percent'] = $product->promo->discount;
                }

                return $data;
            });

        return Inertia::render('Products/Show', [
            'product' => $product,
            'bestSellers' => $bestSellers
        ]);
    }
}

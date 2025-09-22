<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Fauteuil Cuir Vintage',
                'description' => 'Fauteuil en cuir de style vintage, confortable et robuste.',
                'price' => 349.00,
                'stock' => 12,
                'images' => [
                    'front' => 'product_1.png',
                    'left' => 'product_1.png',
                    'right' => 'product_1.png',
                    'bonus' => 'product_1.png',
                ]
            ],
            [
                'name' => 'Chaise Scandinave Bois',
                'description' => 'Chaise légère en bois inspirée du design scandinave.',
                'price' => 129.00,
                'stock' => 30,
                'images' => [
                    'front' => 'product_2.png',
                    'left' => 'product_2.png',
                    'right' => 'product_2.png',
                    'bonus' => 'product_2.png',
                ]
            ],
            [
                'name' => 'Table Basse Industrielle',
                'description' => 'Table basse avec plateau en bois et pieds en métal.',
                'price' => 199.00,
                'stock' => 8,
                'images' => [
                    'front' => 'product_3.png',
                    'left' => 'product_3.png',
                    'right' => 'product_3.png',
                    'bonus' => 'product_3.png',
                ]
            ],
            [
                'name' => 'Lampe Suspension Moderne',
                'description' => 'Lampe suspension pour salon, éclairage doux et design.',
                'price' => 89.00,
                'stock' => 25,
                'images' => [
                    'front' => 'product_4.png',
                    'left' => 'product_4.png',
                    'right' => 'product_4.png',
                    'bonus' => 'product_4.png',
                ]
            ],
            [
                'name' => 'Bibliothèque Étagère Bois',
                'description' => 'Grande bibliothèque modulable pour bureau ou salon.',
                'price' => 259.00,
                'stock' => 6,
                'images' => [
                    'front' => 'product_5.png',
                    'left' => 'product_5.png',
                    'right' => 'product_5.png',
                    'bonus' => 'product_5.png',
                ]
            ],
            [
                'name' => 'Pouff Chesterfield',
                'description' => 'Pouff confortable en tissu rare avec finitions soignées.',
                'price' => 189.00,
                'stock' => 15,
                'images' => [
                    'front' => 'product_6.png',
                    'left' => 'product_6.png',
                    'right' => 'product_6.png',
                    'bonus' => 'product_6.png',
                ]
            ],
            [
                'name' => 'Étagère Murale Design',
                'description' => 'Étagère murale moderne pour optimiser l\'espace.',
                'price' => 79.00,
                'stock' => 20,
                'images' => [
                    'front' => 'product_7.png',
                    'left' => 'product_7.png',
                    'right' => 'product_7.png',
                    'bonus' => 'product_7.png',
                ]
            ],
            [
                'name' => 'Fauteuil Rotin Naturel',
                'description' => 'Fauteuil en rotin tressé naturel, style bohème chic.',
                'price' => 299.00,
                'stock' => 10,
                'images' => [
                    'front' => 'product_8.png',
                    'left' => 'product_8.png',
                    'right' => 'product_8.png',
                    'bonus' => 'product_8.png',
                ]
            ],
            [
                'name' => 'Chaise Bureau Moderne',
                'description' => 'Chaise de bureau ergonomique avec dossier réglable.',
                'price' => 179.00,
                'stock' => 18,
                'images' => [
                    'front' => 'product_9.png',
                    'left' => 'product_9.png',
                    'right' => 'product_9.png',
                    'bonus' => 'product_9.png',
                ]
            ],
        ];

        foreach ($products as $p) {
            Product::create([
                'name' => $p['name'],
                'description' => $p['description'],
                'price' => $p['price'],
                'stock' => $p['stock'],
                'isPinned' => false,
                'available' => true,
                'product_category_id' => 1,
                'color_id' => 1,
                'promo_id' => null,
                'image_front' => $p['images']['front'],
                'image_left' => $p['images']['left'],
                'image_right' => $p['images']['right'],
                'image_bonus' => $p['images']['bonus'],
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\ProductDetail;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $details = [
            [
                'product_id' => 1,
                'width' => 80.00,
                'height' => 90.00,
                'depth' => 70.00,
                'weight' => 15.50,
                'quality_checking' => true,
                'freshness_duration' => 365,
                'packaging_date' => now()->subDays(30),
                'box_content' => 'Fauteuil assemblé, coussins inclus.',
            ],
            [
                'product_id' => 2,
                'width' => 45.00,
                'height' => 85.00,
                'depth' => 50.00,
                'weight' => 8.00,
                'quality_checking' => true,
                'freshness_duration' => 730,
                'packaging_date' => now()->subDays(20),
                'box_content' => 'Chaise assemblée.',
            ],
            [
                'product_id' => 3,
                'width' => 120.00,
                'height' => 45.00,
                'depth' => 80.00,
                'weight' => 25.00,
                'quality_checking' => true,
                'freshness_duration' => 1095,
                'packaging_date' => now()->subDays(15),
                'box_content' => 'Table assemblée, pieds à visser.',
            ],
            [
                'product_id' => 4,
                'width' => 30.00,
                'height' => 150.00,
                'depth' => 30.00,
                'weight' => 3.50,
                'quality_checking' => true,
                'freshness_duration' => 1825,
                'packaging_date' => now()->subDays(10),
                'box_content' => 'Lampe avec ampoule incluse.',
            ],
            [
                'product_id' => 5,
                'width' => 100.00,
                'height' => 200.00,
                'depth' => 30.00,
                'weight' => 40.00,
                'quality_checking' => true,
                'freshness_duration' => 1460,
                'packaging_date' => now()->subDays(25),
                'box_content' => 'Bibliothèque à assembler.',
            ],
            [
                'product_id' => 6,
                'width' => 60.00,
                'height' => 40.00,
                'depth' => 60.00,
                'weight' => 12.00,
                'quality_checking' => true,
                'freshness_duration' => 365,
                'packaging_date' => now()->subDays(5),
                'box_content' => 'Pouff prêt à l\'emploi.',
            ],
            [
                'product_id' => 7,
                'width' => 80.00,
                'height' => 20.00,
                'depth' => 15.00,
                'weight' => 5.00,
                'quality_checking' => true,
                'freshness_duration' => 730,
                'packaging_date' => now()->subDays(12),
                'box_content' => 'Étagère murale avec fixations.',
            ],
            [
                'product_id' => 8,
                'width' => 75.00,
                'height' => 95.00,
                'depth' => 65.00,
                'weight' => 18.00,
                'quality_checking' => true,
                'freshness_duration' => 365,
                'packaging_date' => now()->subDays(8),
                'box_content' => 'Fauteuil assemblé.',
            ],
            [
                'product_id' => 9,
                'width' => 50.00,
                'height' => 110.00,
                'depth' => 55.00,
                'weight' => 10.00,
                'quality_checking' => true,
                'freshness_duration' => 730,
                'packaging_date' => now()->subDays(18),
                'box_content' => 'Chaise de bureau assemblée.',
            ],
        ];

        foreach ($details as $detail) {
            ProductDetail::create($detail);
        }
    }
}

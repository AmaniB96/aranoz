<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'name' => 'Welcome Discount',
                'description' => '10% off for new customers',
                'discount_percentage' => 10,
                'discount_amount' => null,
                'min_purchase_amount' => 50,
                'usage_limit' => 100,
                'expires_at' => Carbon::now()->addMonths(3),
                'is_active' => true,
                'usage_count' => 0,
                'applicable_categories' => null,
            ],
            [
                'code' => 'SAVE20',
                'name' => 'Flash Sale',
                'description' => '20% off on selected items',
                'discount_percentage' => 20,
                'discount_amount' => null,
                'min_purchase_amount' => 100,
                'usage_limit' => 50,
                'expires_at' => Carbon::now()->addDays(7),
                'is_active' => true,
                'usage_count' => 0,
                'applicable_categories' => [1, 2], // Electronics and Clothing
            ],
            [
                'code' => 'FIXED50',
                'name' => 'Fixed Amount Discount',
                'description' => '$50 off on orders over $200',
                'discount_percentage' => null,
                'discount_amount' => 50,
                'min_purchase_amount' => 200,
                'usage_limit' => 25,
                'expires_at' => Carbon::now()->addMonths(1),
                'is_active' => true,
                'usage_count' => 0,
                'applicable_categories' => null,
            ],
            [
                'code' => 'EXPIRED',
                'name' => 'Expired Coupon',
                'description' => 'This coupon has expired',
                'discount_percentage' => 15,
                'discount_amount' => null,
                'min_purchase_amount' => 0,
                'usage_limit' => null,
                'expires_at' => Carbon::now()->subDays(1),
                'is_active' => true,
                'usage_count' => 0,
                'applicable_categories' => null,
            ],
            [
                'code' => 'INACTIVE',
                'name' => 'Inactive Coupon',
                'description' => 'This coupon is not active',
                'discount_percentage' => 5,
                'discount_amount' => null,
                'min_purchase_amount' => 0,
                'usage_limit' => null,
                'expires_at' => null,
                'is_active' => false,
                'usage_count' => 0,
                'applicable_categories' => null,
            ],
        ];

        foreach ($coupons as $couponData) {
            Coupon::create($couponData);
        }
    }
}
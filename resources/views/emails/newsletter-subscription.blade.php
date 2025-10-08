
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Newsletter - Exclusive Discounts</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; background:#f5f5f5; padding:20px; }
        .email-container { max-width:700px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
        .email-header { background:#ff496a; color:#ffffff; text-align:center; padding:30px 20px; }
        .email-header h1 { font-size:32px; margin-bottom:10px; }
        .email-header p { font-size:16px; }
        .products-wrapper { padding:20px; }
        .product-card { border:1px solid #ececec; border-radius:8px; margin-bottom:20px; overflow:hidden; }
        .product-image { position:relative; width:100%; height:220px; background:#f0f0f0; }
        .product-image img { width:100%; height:100%; object-fit:cover; display:block; }
        .discount-badge { position:absolute; top:12px; right:12px; background:#ff496a; color:#ffffff; padding:6px 12px; border-radius:20px; font-weight:bold; font-size:14px; }
        .product-info { padding:18px; }
        .product-name { font-size:20px; margin-bottom:10px; color:#333333; }
        .price-row { margin-bottom:10px; }
        .price-row span { display:inline-block; margin-right:10px; }
        .price-original { color:#999999; text-decoration:line-through; }
        .price-discount { color:#ff496a; font-size:24px; font-weight:bold; }
        .price-saving { color:#28a745; font-size:14px; }
        .shop-now { display:inline-block; margin-top:12px; padding:10px 16px; background:#ff496a; color:#ffffff !important; text-decoration:none; border-radius:6px; font-weight:bold; }
        .no-products { text-align:center; padding:40px 20px; color:#777777; }
        .email-footer { background:#f7f7f7; text-align:center; padding:24px 16px; font-size:13px; color:#777777; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Aranoz Newsletter</h1>
            <p>Exclusive deals curated just for you 🎉</p>
        </div>

        @if(!empty($products))
            <div class="products-wrapper">
                @foreach($products as $product)
                    <div class="product-card">
                        @if(!empty($product['image_path']))
                            <div class="product-image">
                                <img src="{{ $message->embed($product['image_path']) }}" alt="{{ $product['name'] }}" style="width:100%; height:100%; object-fit:cover;">
                                <span class="discount-badge">-{{ $product['discount_percent'] }}%</span>
                            </div>
                        @else
                            <div class="product-image" style="display:flex; align-items:center; justify-content:center; flex-direction:column;">
                                <span class="discount-badge">-{{ $product['discount_percent'] }}%</span>
                                <span style="color:#999;">No image available</span>
                            </div>
                        @endif
                        
                        <div class="product-info">
                            <div class="product-name">{{ $product['name'] }}</div>
                            <div class="price-row">
                                <span class="price-original">${{ $product['original_price'] }}</span>
                                <span class="price-discount">${{ $product['discounted_price'] }}</span>
                            </div>
                            <div class="price-saving">You save ${{ $product['savings'] }}</div>
                            <a class="shop-now" href="{{ url('/products/'.$product['id']) }}">Shop Now →</a>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="no-products">
                No discounts available right now. Stay tuned for upcoming offers!
            </div>
        @endif

        <div class="email-footer">
            © {{ date('Y') }} Aranoz. All rights reserved. This is an automated message; please do not reply.
        </div>
    </div>
</body>
</html>
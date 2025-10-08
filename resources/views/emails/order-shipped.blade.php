<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Been Shipped</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(90deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
        .product-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .product-table th, .product-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .product-table th { background: #f5f5f5; font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; color: #059669; text-align: right; margin-top: 20px; }
        .shipping-info { background: #e0f2fe; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #0284c7; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .total-breakdown { text-align: right; }
        .total-breakdown p { margin: 5px 0; font-size: 16px; }
        .total-breakdown .final-total { font-size: 18px; color: #059669; border-top: 2px solid #eee; padding-top: 10px; margin-top: 10px; }

        .logo {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
}
    </style>
</head>
<body>
    <div class="container">
        <!-- LOGO HEADER -->
        <div class="email-header">
            <div class="logo">
                <a href="{{ url('/') }}">Aranoz.</a>
            </div>
        </div>

        <div class="header">
            <h1>🚚 Your Order Has Been Shipped!</h1>
            <p>Great news! Your order is on its way to you.</p>
        </div>

        <div class="content">
            <div class="order-info">
                <h2>Order Details</h2>
                <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
                <p><strong>Shipping Date:</strong> {{ now()->format('F j, Y') }}</p>
                <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Shipped</span></p>
            </div>

            <h3>Items Shipped</h3>
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                    <tr>
                        <td>{{ $item['name'] }}</td>
                        <td>{{ $item['quantity'] }}</td>
                        <td>${{ number_format($item['unit_price'], 2) }}</td>
                        <td>${{ number_format($item['total'], 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="total">
                <div class="total-breakdown">
                    <p><strong>Sous-total :</strong> ${{ number_format($subtotal, 2) }}</p>
                    @if($discount > 0)
                    <p><strong>Réduction{{ $couponCode ? ' ('.$couponCode.')' : '' }} :</strong> -${{ number_format($discount, 2) }}</p>
                    @endif
                    <p class="final-total"><strong>Total de la commande : ${{ number_format($total, 2) }}</strong></p>
                </div>
            </div>

            <div class="shipping-info">
                <h3>📦 Shipping Information</h3>
                <p>Your order has been carefully packaged and shipped. You should receive it within 3-5 business days.</p>
                <ul>
                    <li><strong>Carrier:</strong> Standard Shipping</li>
                    <li><strong>Estimated Delivery:</strong> {{ now()->addDays(5)->format('F j, Y') }}</li>
                    <li><strong>Tracking:</strong> Tracking information will be sent separately</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/orders/tracking') }}" class="btn tracking-btn">
                    Track Your Order
                </a>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4>📞 Need Help?</h4>
                <p>If you have any questions about your order, please contact our customer service team.</p>
                <p><strong>Email:</strong> support@aranoz.com<br>
                <strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>

            <div class="footer">
                <p>Thank you for shopping with Aranoz!</p>
                <p>We hope to see you again soon.</p>
                <p>&copy; {{ date('Y') }} Aranoz. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
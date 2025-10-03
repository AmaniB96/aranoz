<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Been Shipped</title>
    <link rel="stylesheet" href="order-shipped.css">
</head>
<body>
    <div class="container">
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
                <strong>Order Total: ${{ number_format($total, 2) }}</strong>
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
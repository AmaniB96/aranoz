<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande</title>
    <style>
               body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(90deg, #ff6b8a, #ff3b6b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ff3b6b; }
        .product-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .product-table th, .product-table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .product-table th { background: #f5f5f5; font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; color: #ff3b6b; text-align: right; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .total-breakdown { text-align: right; }
        .total-breakdown p { margin: 5px 0; font-size: 16px; }
        .total-breakdown .final-total { font-size: 18px; color: #ff3b6b; border-top: 2px solid #eee; padding-top: 10px; margin-top: 10px; }


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
            <h1>🎉 Merci pour votre commande !</h1>
            <p>Votre commande a été confirmée avec succès</p>
        </div>

        <div class="content">
            <div class="order-info">
                <h2>Détails de la commande</h2>
                <p><strong>Numéro de commande :</strong> {{ $order->order_number }}</p>
                <p><strong>Date :</strong> {{ $order->date->format('d/m/Y H:i') }}</p>
                <p><strong>Statut :</strong> {{ ucfirst($order->status) }}</p>
            </div>

            <h3>Articles commandés</h3>
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
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

            <div style="margin-top: 30px;">
                <h3>Que se passe-t-il ensuite ?</h3>
                <ul>
                    <li>Nous préparons votre commande</li>
                    <li>Vous recevrez un email de suivi</li>
                    <li>La livraison sera effectuée sous 3-5 jours ouvrés</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ url('/orders/tracking') }}" class="btn">Suivre ma commande</a>
            </div>

            <div class="footer">
                <p>Si vous avez des questions, contactez-nous à support@aranoz.com</p>
                <p>&copy; {{ date('Y') }} Aranoz. Tous droits réservés.</p>
            </div>
        </div>
    </div>
</body>
</html>
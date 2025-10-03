<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de commande</title>
    <link rel="stylesheet" href="order-confirmation.css">
</head>
<body>
    <div class="container">
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
                <strong>Total de la commande : ${{ number_format($total, 2) }}</strong>
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
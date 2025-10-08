<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
    <link rel="stylesheet" href="contact-message.css">
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
            <h1>📬 Nouveau message de contact</h1>
            <p>Vous avez reçu un nouveau message depuis votre site web</p>
        </div>

        <div class="content">
            <div class="message-box">
                <div class="info-row">
                    <span class="label">De :</span>
                    <span class="value">{{ $contactData['name'] }} ({{ $contactData['email'] }})</span>
                </div>

                <div class="info-row">
                    <span class="label">Sujet :</span>
                    <span class="value">{{ $contactData['subject'] }}</span>
                </div>

                <div class="info-row">
                    <span class="label">Date :</span>
                    <span class="value">{{ now()->format('d/m/Y H:i') }}</span>
                </div>
            </div>

            <h3>Message :</h3>
            <div class="message-content">
                <p style="margin: 0; white-space: pre-line;">{{ $contactData['message'] }}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:{{ $contactData['email'] }}?subject=Re: {{ $contactData['subject'] }}" class="reply-btn">
                    Répondre à ce message
                </a>
            </div>

            <div class="footer">
                <p>Ce message a été envoyé automatiquement depuis le formulaire de contact de votre site web.</p>
                <p>&copy; {{ date('Y') }} Aranoz. Tous droits réservés.</p>
            </div>
        </div>
    </div>
</body>
</html>
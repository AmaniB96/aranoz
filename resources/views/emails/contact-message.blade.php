<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }

/* STYLES POUR LE LOGO */
.email-header {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 30px;
}
.logo {
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
}
.logo a {
    text-decoration: none;
    color: inherit;
}

.header { background: linear-gradient(90deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
.message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
.info-row { margin: 10px 0; }
.label { font-weight: bold; color: #555; }
.value { color: #333; }
.message-content { background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 3px solid #667eea; }
.footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
.reply-btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
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
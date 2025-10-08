<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found - Aranoz</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    
    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/welcome.css') }}" rel="stylesheet">
    <link href="{{ asset('errors/error-styles.css') }}" rel="stylesheet">
</head>
<body>
    <div class="error-page">
        <div class="error-container">
            <!-- REMPLACER LE SVG PAR LE LOGO ARANOZ -->
            <div class="error-logo">
                <a href="{{ url('/') }}">Aranoz.</a>
            </div>
            
            <h1 class="error-code">404</h1>
            <h2 class="error-title">Page Not Found</h2>
            <p class="error-message">
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            <div class="error-actions">
                <a href="{{ url('/') }}" class="btn-primary">
                    ← Back to Home
                </a>
            </div>
        </div>
    </div>
</body>
</html>
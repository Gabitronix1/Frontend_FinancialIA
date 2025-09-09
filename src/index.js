<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Mi Agente Financiero Personal</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="description" content="Tu asistente personal para el control de gastos y presupuestos" />
    <meta name="theme-color" content="#667eea" />
    
    <!-- Favicon usando emoji -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏦</text></svg>">
    
    <!-- Fuentes de Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      }
      
      /* Loading animation */
      .loading {
        opacity: 0.7;
        pointer-events: none;
      }
      
      /* Smooth transitions */
      * {
        transition: all 0.2s ease;
      }
      
      /* Scrollbar personalizado */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(255,255,255,0.1);
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.3);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.5);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <div style="text-align: center; padding: 50px; background: white; margin: 50px; border-radius: 10px;">
        <h2>🏦 Mi Agente Financiero</h2>
        <p>Necesitas habilitar JavaScript para usar esta aplicación.</p>
      </div>
    </noscript>
  </body>
</html>

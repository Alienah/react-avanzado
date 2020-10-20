# React avanzado

# PWA

Para que nuestra aplicación funcione como Progresive Web App tenemos que proveerla de varias cosas. Para saber qué cosas tenemos y cuáles nos faltan podemos usar la herramienta de las dev tools _Lighthouse_

Si ejecutamos una auditoría sobre nuetra página servida con ```npm run serve:dev```, veremos uno a uno las características que nos quedan por mejorar:

## Proveer de un fallback cuando no se está cargando javascript

```
Does not provide fallback content when JavaScript is not available

The page body should render some content if its scripts are not available.
```

Esto lo solucionamos rápidamente añadiendo en el ```index.html``` una etiqueta ```noscript```:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Petgram</title>
</head>
<body>
    <div id="app"></div>
    <noscript>
      <h3>Esta app necesita Javascript para funcionar correctamente.</h3>
    </noscript>
</body>
</html>
```

## Manifest

```Failures: No manifest was fetched.```

Primero vamos a instalar un plugin de webpack como dependencia de desarrollo:

```npm install webpack-pwa-manifest -D```

Y configuramos los detalles del manifest que nos faltan (lighthouse nos da pistas)

```js
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifestPlugin = require('webpack-pwa-manifest');
const path = require('path');

module.exports = {
  output: {
    filename: 'app.bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new WebpackPwaManifestPlugin({
      name: 'Petgram - Tu app de fotos de mascotas',
      shortname: 'Petgram 🐶',
      description: 'Con Petgram puedes encontrar fotos de tus animales domésticos muy fácilmente',
      background_color: '#fff',
      theme_color: '#b1a',
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          // Los diferentes tamaños que normalmente utilizan
          // los dispositivos móviles para mostrar la pwa
          sizes: [96, 128, 192, 256, 384, 512],
          purpose: 'any maskable',
        },
      ],
    }),
  ],
//  ...
};

```

## Service worker

Otra de las acciones que tenemos que llevar a cabo para tener una PWA es la de tener un service worker.

Para ello vamos a instalar una serie de utilidades de google para ayudarnos a crear service workers y añadir compatibilidad offline a nuestra aplicación.

```npm install workbox-webpack-plugin -D```

Ahora configuramos nuestro webpack para indicarle cómo queremos que nos genere el serviceworker:

```js
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifestPlugin = require('webpack-pwa-manifest');
const WorboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  output: {
    // ...
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new WebpackPwaManifestPlugin({
      // ...
    }),
    // Esta es la utilidad de Webbox que nos va a generar un service worker
    new WorboxWebpackPlugin.GenerateSW({
      // Le damos las instrucciones de lo que tiene que cachear
      runtimeCaching: [
        {
          // Por ejemplo aquí le estamos indicando la url desde la que estamos cargando las imágenes
          // que puede ser cloudinary o unsplash.com
          urlPattern: new RegExp('https://(res.cloudinary.com|images.unsplash.com)'),
          // También le podemos decir la estrategia que debe seguir
          // Por ejemplo cacheFirst para mirar si está en la caché antes de en la red
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
          },
        },
        {
          urlPattern: new RegExp('https://petgram-api-server.vercel.app/'),
          // En este caso queremos que los datos los traiga frescos
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api',
          },
        },
      ],
      // Para que no de error porque no puede cachear el app.bundle
      maximumFileSizeToCacheInBytes: 5000000,
    }),
  ],
//  ...
};

```

Después de haber configuirado esto, tenemos que registrar en el index.html el service worker que se va a generar

```html

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Petgram</title>
    <link rel="apple-touch-icon" href="/src/assets/icon.png">
</head>
<body>
    <div id="app"></div>
    <noscript>
      <h3>Esta app necesita Javascript para funcionar correctamente.</h3>
    </noscript>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
              console.log('SW registered');
            })
            .catch((registrationError) => {
              console.log('SW error', registrationError);              
            })
        })
      }
    </script>
</body>
</html>
```

Ahora ya podemos cachear la aplicación e incluso podremos descargar la app en el ordenador, ya que ya es una PWA.

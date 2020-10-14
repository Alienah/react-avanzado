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

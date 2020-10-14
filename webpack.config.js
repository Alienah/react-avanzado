const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifestPlugin = require('webpack-pwa-manifest');
const WorboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  // En el objeto le decimos que el output va a estar en un archivo app.bundle.js
  output: {
    filename: 'app.bundle.js',
    publicPath: '/',
  },
  // Además le podemos decir qué plugins queremos que utilice
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
      maximumFileSizeToCacheInBytes: 5000000,
    }),
  ],
  //  Le añadimos una nueva configuración
  module: {
    // Le vamos a especificar las reglas que queremos que tengan nuestros módulos
    rules: [
      {
        // Le decimos que tiene que usar esta regla para todos los archivos que sean de javascript
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          //  le decimos que en esos casos use este loader
          loader: 'babel-loader',
          options: {
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }, '@babel/plugin-syntax-dynamic-import'],
            ],
            // Con la opción de este preset
            presets: [
              '@babel/preset-env', '@babel/preset-react',
            ],
          },
        },
      },
      // para evitar los warning en navegador de los source-map-loader de los node modules
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
};

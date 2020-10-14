const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifestPlugin = require('webpack-pwa-manifest');
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

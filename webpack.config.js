const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // En el objeto le decimos que el output va a estar en un archivo app.bundle.js
  output: {
    filename: 'app.bundle.js',
  },
  // Además le podemos decir qué plugins queremos que utilice
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
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
            // Con la opción de este preset
            presets: [
              '@babel/preset-env', '@babel/preset-react',
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { regenerator: true }],
            ],
          },
        },
      },
    ],
  },
};

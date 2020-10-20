# REACT AVANZADO

## Configuración de un proyecto desde 0 paso a paso:

### 1. **Instalación Webpack**:

```bash
npm init -y
```

```bash
npm install webpack webpack-cli --save-dev
```

**Prueba inicial**

Creamos una carpeta src y un index.js, el cual vamos a empaquetar con webpack:

```bash
./node_modules/.bin/webpack src/index.js
```

Esto significa que accedemos a webpack que está en node modules, en bin y le decimos que empaquete el index que está en src.

También se podría usar el equivalente

```bash
npx webpack src/index.js
```

Comprobamos que se ha creado una carpeta dist con main.js y arrancamos nuestro archivo en node con 

```bash
node dist/main.js
```

**Html plugin**

Pero como lo que queremos es usar html, necesitamos instalar el plugin de webpack para usar con html

```bash
npm install html-webpack-plugin --save-dev
```

Para poder usar este plugin, vamos a tener que crear un archivo de configuración de webpack ```webpack.config.js```.

La configuración de webpack lo que tiene que exportar es un objeto:

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  // En el objeto le decimos que el output va a estar en un archivo app.bundle.js
  output: {
    filename: 'app.bundle.js',
  },
  // Además le podemos decir qué plugins queremos que utilice
  plugins: [
    new HtmlWebpackPlugin(),
  ]
}
```

Ahora ya podemos añadir un script de _build_ en nuestro _package.json_ que ejecutará webpack, que a su vez por defecto buscará en el _index.js_ de _src_

```json
"build": "webpack",
```

Ya podemos construir nuestra build con ```npm run build```.

**Dev server**

Por último, vamos a instalar un servidor de webpack

```bash
npm install webpack-dev-server --save-dev
```

Para poder usarlo, vamos a incluir un nuevo script:

```json
"dev": "webpack-dev-server",
```

Y ya podríamos arrancar nuestro servidor que además detecta los nuevos cambios.

```npm run dev```

### 2. **Instalación React y Babel**

**React y React-dom**

_React_, que es la librería _React_ y _React-dom_, que es la librería que nos permitirá renderizar nuestros componentes de React en el DOM

```bash
npm install react react-dom
```

Modificamos el index.js para trabajar con react

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render('Hola', document.getElementById('app'));
```

Y creamos un index.html para poder insertar todo nuestra aplicación de React en el elemento del DOM con id que nosotros especifiquemos.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Wowgram</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

Como hemos añadido un html nuevo, tenemos que indicarle a webpack que use este y no el de por defecto

```js
// webpack.config
// ...

plugins: [
  new HtmlWebpackPlugin({
    template: 'src/index.html'
  }),
]
```

**Babel**

Ahora ya tenemos nuestro html y nuestro index.js cargado ahí, sin embargo queremos poder usar componentes u objetos de html en lugar de esa frase que tenemos en el ejemplo y para ello hay que instalar Babel, ya que de otro modo no entiende qué estamos intentando insertar (Recordemos la web de [babel](https://babeljs.io/) en la que podemos probar y ver la transformación de jsx a javascript vanilla).

```bash
npm install @babel/core @babel/preset-env babel-loader --save-dev
```

Con _@babel/preset-env_ vamos a hacer que las transformaciones que se hagan de javascript estén basadas en la última versión oficial aceptada por el ECMASCRIPT committee. Así controlamos los navegadores en los que queremos que esté soportado.

Y _babel-loader_ es el plugin para webpack

```js
// webpack config

// ...
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
  //Le añadimos una nueva configuración
  module: {
    // Le vamos a especificar las reglas que queremos que tengan nuestros módulos
    rules: [
      {
        // Le decimos que tiene que usar esta regla para todos los archivos que sean de javascript
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          //le decimos que en esos casos use este loader
          loader: 'babel-loader',
          options: {
            // Con la opción de este preset
            presets: [
              '@babel/preset-env', '@babel/preset-react'
            ],
          },
        },
      }
  
    ]
  }
// ...

```

Otro preset que necesitamos usar es el de _preset-react_, para que pueda transformar JSX.

```bash
npm install @babel/preset-react --save-dev
```

Y añadimos el preset

```js
// webpack config

// ...
presets: [ '@babel/preset-env','@babel/preset-react' ],
// ...
```

Y para poder usar entre otras cosas _async await_...

```bash
npm install @babel/plugin-transform-runtime --save-dev
```

Y en webpack.config.js

```js
// webpack.config.js

// ...
options: {
  presets: [
    '@babel/preset-env', '@babel/preset-react',
  ],
  // Añadimos este plugin
  plugins: [
    ['@babel/plugin-transform-runtime', { regenerator: true }],
  ],
},
// ...
```

### 3. **Instalación linter, extensiones y deploy con Vercel**

Para el linter, hemos elegido la configuración de airbnb

```bash
npx install-peerdeps --dev eslint-config-airbnb
```

Con esta configuración de eslintrc

```json
// .eslintrc

{
    "extends": ["airbnb", "airbnb/hooks"],
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "no-underscore-dangle": "off",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
    }
}
```

**Desplegar servidor y cliente**

Para desplegar nuestro proyecto vamos a usar Vercel (Antes now)

Instalar de forma global la aplicación en nuestro sistema operativo

```bash
npm i -g vercel
```

Hacer ```vercel login```

Configurar un vercel.json para desplegar tanto el back como el front (Ver en el proyecto ejemplos)

### 4. Estilos

**CSS in JS**

Ventajas:

* El nombrado de clases no colisiona con el resto de la aplicación, ya que está asociado el estilo a un componente concreto.

* Tenemos localizado el css más crítico (el que depende por ejemplo de props, etc)

**Styled-components**

Hay librerías que ofrecen esta alternativa y en concreto _Styled-components_ está adaptada a react, así que vamos a instalarala en la aplicación:

* Instalación

```bash
npm install styled-components
```

* Ejemplos de estilos con styled-components

```js
// /components/Category/styles.js

import styled from 'styled-components';

export const Anchor = styled.a`
  display: flex;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  width: 75px;
`;

export const Image = styled.img`
  border: 1px solid #ddd;
  box-shadow: 0px 10px 14px rgba(0, 0, 0, .2);
  border-radius: 50%;
  height: auto;
  overflow: hidden;
  object-fit: cover;
  height: 75px;
  width: 75px;
`;
```

```js
// /components/Category/index.js

import React from 'react';
// Importamos las variables que hemos creado en styles.js así:
import { Anchor, Image } from './styles';

const DEFAULT_IMAGE = 'https://i.imgur.com/dJa0Hpl.jpg';

export const Category = ({ cover = DEFAULT_IMAGE, path, emoji = '?' }) => (
  <Anchor href={path}>
    <Image src={cover} alt="imagen" />
    {emoji}
  </Anchor>
);
```

* Estilos globales con styled-components

Para poder establecer estilos globales a toda la palicación, crearemos en la carpeta _src_ un archivo _GlobalStyles.js_ en el que importaremos **_createGlobalStyle_** de _styled-components_.

```js
//  /src/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  ul, li, h1, h2, h3, p, button {
    margin: 0;
  }

  ul {
    list-style: none;
  }

  button {
    background: transparent;
    border: 0;
    outline: 0;
  }

  body {
    background: #fefefe;
    height: 100vh;
    margin: 0 auto;
    max-width: 500px;
    /* para evitar que haga rebotes en la aplicació cuando usemos el scroll */
    overscroll-behavior: none;
    width: 100%;
  }

  #app {
    box-shadow: 0 0 10px rgba(0, 0, 0, .05);
    overflow-x: hidden;
    min-height: 100vh;
    padding-bottom: 10px;
  }
`;
```

```js
// src/App.js

import React from 'react';
import { ListOfCategories } from './components/ListOfCategories';
import { GlobalStyle } from './GlobalStyles';

const App = () => (
  <div>
    <GlobalStyle />
    <ListOfCategories />
  </div>
);

export default App;
```

### 5. Datos de usuario importados

Podemos pasar las props de un objeto de un json con spread operator.

```js
import React from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';
import { categories } from '../../../api/db.json';

export const ListOfCategories = () => (
  <List>
    {
      categories.map((category) => <Item key={category.id}><Category {...category} /></Item>)
    }
  </List>
);
```

O así: (El linter no recomienda usar el spread en props)

```js
// ListOfCategories.js

import React from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';
import { categories } from '../../../api/db.json';

export const ListOfCategories = () => (
  <List>
    {
      categories.map((category) => {
        const {
          cover, emoji, name, path,
        } = category;
        return (
          <Item key={category.id}>
            <Category
              cover={cover}
              emoji={emoji}
              name={name}
              path={path}
            />
          </Item>
        );
      })
    }
  </List>
);
```

### 6. React icons

Es una librería que tiene muchos iconos (material design, game icons, etc). Visita esta [página](https://react-icons.github.io/react-icons/) para ver el catálogo.

La instalaríamos como dependencias:

```bash
npm install react-icons
```

### 7. Crear un logo svg

* Visitamos la página [maketext](https://maketext.io/) en la que podremos crear a partir de un texto, un diseño totalmente personalizado y en un par de clicks.

* Descargamos el svg

* Visitamos la página de [svgomg](https://jakearchibald.github.io/svgomg/) para optimizar nuestro svg.

* Copiamos el svg generado ( o lo descargamos)

* Pasamos el svg a un componente de React. Para ello, podemos usar el proyecto [svgr](https://react-svgr.com/playground/)

* Introducimos ese componente en nuestra carpeta components y de este modo lo podemos tratar como un componente más, con sus styles y su index.

```js
// src/Logo/index,js

import * as React from 'react';
import { Svg } from './styles';

export const Logo = (props) => (
  <Svg
    width={370.774}
    height={157.318}
    viewBox="64.613 -3.659 370.774 157.318"
    style={{
      background: '0 0',
    }}
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <defs>
      // ...
    </defs>
    <g filter="url(#prefix__editing-gradow-filter)">
      <path
        d="...
        ...
        ..."
        fill="url(#prefix__editing-gradow-gradient)"
        transform="translate(124.75 104.055)"
      />
    </g>
    <style />
  </Svg>
);
```

```js
// src/Logo/sytles,js

import styled from 'styled-components';

export const Svg = styled.svg`
  width: 230px;
  margin-left: -10px;
  margin-top: -30px;
  margin-bottom: -20px;
`;
```

### 9. Animaciones

Para crear animaciones, vamos a usar una herramienta de styled-component que es para keyframes, llamada, como su nombre indica: _keyframes_.

Ademñas, una forma de optimizar nuestra aplicación es crear funciones de animaciones que podamos reusar.

Ejemplo:

```js
// src/styles/animation.js

import { css, keyframes } from 'styled-components';

const fadeInKeyframes = keyframes`
  from {
    filter: blur(5px);
    opacity: 0;
  }

  to {
    filter: blur(0);
    opacity: 1;
  }
`;

// Para hacer más reutilizable la animación creamos una función.
export const fadeIn = ({ time = '1s', type = 'ease' } = {}) => css`animation: ${time} ${fadeInKeyframes} ${type};
`;

```
Y la usaríamos así

```js
// src/components/PhotoCard/styles.js

import { fadeIn } from '../../styles/animation';

// ...
// Aquí usamos la función con otros valores como parámetro
export const Img = styled.img`
  ${fadeIn({ time: '5s' })}
  box-shadow: 0 10px 14px rgba(0, 0, 0, .2);
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  width: 100%;
`;
// ...
```

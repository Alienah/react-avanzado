# REACT AVANZADO

# Reach Router

Creado por el mismo que creó React Router, en un futuro se fusionarán.

## Instalación

```npm install @reach/router```

## Uso

Una de las primeras utilidades que vamos a usar es Router, que nos servirá para especificar las rutas.

Importante destacar quie Router está disponible en cualquier parte de la aplicación sin necesidad de tener que introducir la App en un wrapper.

En App lo podríamos usar así:

```js
// src/App.js

import React from 'react';
// Nos va a permitir cambiar de ruta
// Está disponible en toda la aplicación y no nos tenemos que preocupar por englobar la App, etc
import { Router } from '@reach/router';
import { GlobalStyle } from './styles/GlobalStyles';
import { PhotoCardWithQuery } from './containers/PhotoCardWithQuery';
import { Home } from './pages/Home';
import { Logo } from './components/Logo';

const App = () => {
  // URLSearchParams recibe un parámetro, que va a ser la query string
  const urlParams = new window.URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');

  return (
    <div>
      <GlobalStyle />
      <Logo />
      {
        detailId
          ? <PhotoCardWithQuery id={detailId} />
          : (
            <Router>

              <Home path="/" />
              <Home path="/pet/:id" />
            </Router>
          )
      }
    </div>
  );
};

export default App;

```

Habiendo creado previamente las páginas. Esta es la Home:

```js
// src/pages/Home.js

import React from 'react';
import { ListOfCategories } from '../components/ListOfCategories';
import { ListOfPhotoCards } from '../containers/ListOfPhotoCards';

export const Home = () => (
  <>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={2} />
  </>
);
```

Y para adaptar ese path del Router pet/:id, modificamos el path que le pasamos a la Category desde ListOfCategories:

```js
  // src/components/ListOfCategories/index.js

  // ...

  const renderList = (fixed) => (
    <List fixed={fixed}>
      {
        loading
          ? <Item key="loading"><Category /></Item>
          : categories.map((category) => {
            const {
              cover, emoji, id, name, path,
            } = category;
            return (
              <Item key={id}>
                <Category
                  cover={cover}
                  emoji={emoji}
                  name={name}
                  path={`/pet/${id}`}
                />
              </Item>
            );
          })
    }
    </List>
  );

  // ...

```

Sin embargo, si probamos en el navegador, aunque al hacer click en un category, viaja a la ruta correcta, pero se ve en pantalla un error 404 y no se ve nada. No hay un error en el código y no muestra nada en la consola, eso es porque webpack está intentando cargar físicamente esa url, así que tenemos que cambiar cómo inicializamos con webpack nuestro entorno de desarrollo. Añadiremos el flag ```--history-api-fallback```:

```json
// package.json

"dev": "webpack-dev-server --history-api-fallback",
```

De esta manera, cada vez que intente acceder a una ruta, el fallback que va a usar va a ser siempre el index.html, de modo que si hay un 404, va a intentar acceder al index.html. Esto es así porque nuestro enrutado está en el cliente.

Si volvemos a arrancar el entorno, ahora ya vemos un error diferente, un error de que no encuentra el archivo app.bundle.js.

Para solucionarlo, vamos a cambiar en la configuración de webpack lo siguiente:

Vamos a decirle que el path del output donde debe encontrar ese bandle sea ```/```, la raíz. De esta forma no intentará en la ruta buscar ese archivo.

```js
// webpack.config.js

  output: {
    filename: 'app.bundle.js',
    publicPath: '/',
  },
```

Ahora faltaría el último paso para que cuando haga click en una categoría se vea lo correspondiente a la id de esa categoría. Para ello, vamos a decirle a Home, que va a recibir una id, la cual va a recuperar del path (recordemos que el path contiene la variable id a la que viaja)

```js
// Home.js
// ...
export const Home = ({ id }) => (
  <>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={id} />
  </>
);
```


# REACT AVANZADO

# Performance

Ya sabemos que es importante cuidar la performance de nuestra aplicación para que la experiencia de usuario sea lo más satisfactoria posible. Para conseguirlo podemos tomar medidas.

## Primer paso

Lo primero que vamos a hacer en nuestra aplicación ejemplo es compilar en modo desarrollo

```bash
./node_modules/.bin/webpack --mode "development"
```

Y para poder servirlo:

```npx serve dist -s```

(Le estamos diciendo la ruta que queremos que nos sirva, dist, y que es una single page application, -s, con lo que queremos que siempre cargue el index, da igualla ruta)

También podemos añadir un script que haga las dos cosas:

```json
// package.json

"serve:dev": "webpack --mode 'development' && npx serve dist -s",
```

Una vez servido, podemos inspeccionarlo con las herramientas dev tools o react tools para medir la performance.

## Memo de React

Una de las medidas que podemos tomar es usar el memo de React. Cuando un componente está envuelto en React.memo, react memoiza el resultado del renderizado, de manera que evita renderizados innecesarios. Antes del siguiente renderizado, si detecta que las nuevas props son las mismas, reúsa el componente memoizado y así evita volver a renderizar.

Por ejemplo, imaginemos que en nuetra performnace vemos que el componente ListOfCategories se renderiza cada vez que hago clik a una categoría. En realidad el componente no cambia y no se debería volver a renderizar, así que podemos usar memo así:

```js
// src/components/ListOfCategories/index.js

// ...

const ListOfCategoriesComponent = () => {
// ...

export const ListOfCategories = React.memo(ListOfCategoriesComponent);
```

Otro ejemplo sería pasándole como segundo parámetro una función que recibe las props antiguas y las nuevas y las podemos comprar. Si son las mismas, usará el memo.

```js
// src/pages/Home.js

import React from 'react';
import { Helmet } from 'react-helmet';
import { ListOfCategories } from '../components/ListOfCategories';
import { ListOfPhotoCards } from '../containers/ListOfPhotoCards';

const HomePage = ({ categoryId }) => (
  <>
    <Helmet>
      <title>Petgram - Tu app de fotos de mascotas</title>
      <meta name="description" content="Con Petgram puedes encontrar fotos de animales domésticos muy bonitos" />
    </Helmet>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={categoryId} />
  </>
);

export const Home = React.memo(
  HomePage,
  (prevProps, props) => prevProps.categoryId === props.categoryId,
);

```

## Lazy load y Suspense

Vamos a querer también que sólo nos cargue determinado contenido cólo cuando lo necesitemos y no al iniciar la página. para ello, vamos a usar lazy components.

```React.lazy``` lo que necesita para funcionar es una fucnión que devuelve un import dinámico. Vamos a ver un ejemplo importando de forma dinámica la página de favoritos.

Sin embargo, para que no tengamos errores a la hora de renderizar cuando queremos cargar ese componente lazy, tenemos que usar suspense, que es una utilidad de React que nos va a permitir renderizar algo mientras otro componente está en modo suspensión.

```js
// App.js

import React, { useContext, Suspense } from 'react';
import { Redirect, Router } from '@reach/router';
import { GlobalStyle } from './styles/GlobalStyles';
import { NotFound } from './pages/NotFound';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
// import { Favs } from './pages/Favs';
import { User } from './pages/User';
import { NotRegisteredUser } from './pages/NotRegisteredUser';
import { Logo } from './components/Logo';
import { NavBar } from './components/NavBar';
import { Context } from './Context';

// Aquí hacemos el import dinámico con lazy
// Pero previamente hemos tenido que cambiar la página de Favs para que tenga un export default
const Favs = React.lazy(() => import('./pages/Favs'));

const App = () => {
  const { isAuth } = useContext(Context);
  return (
    // Envolvemos la aplicación con Suspense
    <Suspense fallback={<div />}>
      <GlobalStyle />
      <Logo />
      <Router>
        <NotFound default />
        <Home path="/" />
        <Home path="/pet/:categoryId" />
        <Detail path="/detail/:detailId" />
        {!isAuth && <NotRegisteredUser path="/login" />}
        {!isAuth && <Redirect from="/favs" to="/login" noThrow />}
        {!isAuth && <Redirect from="/user" to="/login" noThrow />}
        {isAuth && <Redirect from="/login" to="/" noThrow />}
        <Favs path="/favs" />
        <User path="/user" />
      </Router>
      <NavBar />

    </Suspense>
  );
};

export default App;

```

```js
// src/pages/Favs.js

import React from 'react';
import { Layout } from '../components/Layout';
import { ListOfFavs } from '../containers/ListOfFavs';

export default () => (
  <Layout title="Tus favoritos" subtitle="Aquí puedes encontrar tus favoritos">
    <ListOfFavs />
  </Layout>
);
```

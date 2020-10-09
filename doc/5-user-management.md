# REACT AVANZADO

# User Management. Gestión del usuario

## Rutas protegidas

Queremos proteger las rutas para que si está logeado es usuario vea un contenido y, si no lo está, vea otro, así que vamos a comenzar haciendo un cambio pequeño.

A través de las render props vamos a crear un renderizado condicional, de manera que dependiendo de si el valor es false o true, se vean unas páginas u otras en las misma rutas

Creamos páginas d emomento sin casi contenido, sólo para probar que funciona, por ejemplo

```js
// pages/Favs.js

import React from 'react';

export const Favs = () => (
  <h1>Favs</h1>
);

```
Y lo mismo para 

```pages/User.js```

```pages/NotRegisteredUser.js```

Y en la app, vamos a usar las render props así:

```js
// App.js

import React from 'react';
import { Router } from '@reach/router';
import { GlobalStyle } from './styles/GlobalStyles';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Favs } from './pages/Favs';
import { User } from './pages/User';
import { NotRegisteredUser } from './pages/NotRegisteredUser';
import { Logo } from './components/Logo';
import { NavBar } from './components/NavBar';

// Recordemos que las render props renderizan una función en vez de un componente y que a través de la función children podemos inyectarle los valores que necesitemos
const UserLogged = ({ children }) => children({ isAuth: false });

const App = () => (
  <div>
    <GlobalStyle />
    <Logo />
    <Router>
      <Home path="/" />
      <Home path="/pet/:categoryId" />
      <Detail path="/detail/:detailId" />
    </Router>
    <UserLogged>
      {
          ({ isAuth }) => (isAuth
            ? (
              <Router>
                <Favs path="/favs" />
                <User path="/user" />
              </Router>
            )
            : (
              <Router>
                <NotRegisteredUser path="/favs" />
                <NotRegisteredUser path="/user" />
              </Router>
            ))
        }
    </UserLogged>
    <NavBar />
  </div>
);

export default App;

```

En la función children de las render props le decimos que renderizará un Router u otro dependiendo de is isAith es true o false.

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

## Usando Context de React para gestionar login

Para tener acceso desde toda la aplicación a ciertos datos, podemos usar ```createContext``` de React. Nosotros vamos a usarlo aquí para gestionar el login del usuario.

Creamos en la raíz un archivo ```Context.js```

```js
// src/Context.js

import { createContext } from 'react';

const Context = createContext();

export default Context;

```

Ahora lo tenemos que usar en el index.js, ya que tenemos que wrappear con él toda la aplicación, para que pueda acceder a los valores de contexto

```js
// Index.js

import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// Igual que el ApolloProvider, el Context también tiene que wrappear la aplicación,
// para poder tener acceso a él desde cualquier sitio.
import Context from './Context';

import App from './App';

const client = new ApolloClient({
  uri: 'https://petgram-api-server.vercel.app/graphQL',
});

ReactDOM.render(
  // Accedemos al componente Provider y
  // en value especificamos todos los valores que queremos que tenga el árbol accesible
  <Context.Provider value={{ isAuth: false }}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Context.Provider>, document.getElementById('app'),
);
```

Una vez hecho esto, podemos acceder a los datos a través de otro componente del Context llamado Consumer.  Nos vamos entonces a la App y en vez del componente render props que usábamos antes 

```js
const UserLogged = ({ children }) => children({ isAuth: false });
```

Ahora podemos usar directamente el componente Consumer, así:

```js
// App.js

// ...
import Context from './Context';

const App = () => (
  <div>
    <GlobalStyle />
    <Logo />
    <Router>
      <Home path="/" />
      <Home path="/pet/:categoryId" />
      <Detail path="/detail/:detailId" />
    </Router>
    <Context.Consumer>
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

    </Context.Consumer>

    <NavBar />

  </div>
);

export default App;

```

El Context.Provider del index,js está usando las mismas props que nuestro componente render props: ```({ isAuth: false })``` , con lo que no hace falta que hagamos nada más.


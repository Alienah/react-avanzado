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

## Modificamos Context.Provider a través de render props

Para poder controlar los valores que les vamos a pasar con el contexto al resto de las aplicación, vamos a hacer unas modificaciones en ```Context.js```.  En concreto, vamos a modificar su componente ```Provider``` a través de la técnica render props.

```js
// src/Context.js

import React, { createContext, useState } from 'react';

const Context = createContext();

// Vamos a modificar el componente Provider
// y le añadimos un estado para saber si está autentificado o no
// Y esto, como se puede apreciar lo hacemos con la ténica de render props
const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  // Esto es lo que vamos a pasarle como prop al Provider.
  // Con lo cual, es el que vamos a poder acceder desde toda la aplicación
  const value = {
    isAuth,
    activateAuth: () => {
      setIsAuth(true);
    },
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

// Exportamos en nuevo Provider y el Consumer por defecto
export default {
  Provider,
  Consumer: Context.Consumer,
};

```

Hecho esto, ya podríamos eliminar del ```Index.js``` la prop value de ```<Context.Provider value={{ isAuth: true }}>```, porque ya lo tenemos definido en el ```Context.js```.

```js
// Index.js

ReactDOM.render(
  <Context.Provider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Context.Provider>, document.getElementById('app'),
);
```

Ahora vamos a ver cómo sacarle partido a este cambio que acabamos de hacer. Vamos a cambiar la página de NotRegistered para que pueda hacer login

```js
// pages/NotRegisteredUser.js

import React from 'react';
import Context from '../Context';

export const NotRegisteredUser = () => (
  // Usamos el consumer, ya que lo que queremos es acceder a los datos
  // El consumer lo que recibe es una render prop
  <Context.Consumer>
    {
      // Accedemos a uno de los values del Context que hemos definido antes, el activateAuth
      ({ activateAuth }) => (
        <form onSubmit={activateAuth}>
          <button type="submit">Iniciar sesión</button>
        </form>
      )
    }
  </Context.Consumer>
);
```

## Registro e inicio de sesión en base de datos.

Vamos a usar una mutación de graphql para manejar esta información en la base de datos.

Creamos el archivo ```RegisterMutation.js``` que va a contener la mutación de graphql y va a devolver un componente que usa render props.

```js
// src/containers/RegisterMutation.js

import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

const REGISTER = gql`
  mutation signup($input: UserCredentials!) {
    signup(input: $input)
  }
`;

// Vamos a pasarle a los children esta mutación
export const RegisterMutation = ({ children }) => (
  <Mutation mutation={REGISTER}>
    {children}
  </Mutation>
);

```

En ```NotRegisteredUser.js``` le decimos cuándo y con qué datos ejecutar esa mutación _register_

```js
// src/pages/Notregistereduser.js

import React from 'react';
import Context from '../Context';
import { UserForm } from '../components/UserForm';
import { RegisterMutation } from '../containers/RegisterMutation';

export const NotRegisteredUser = () => (
  <Context.Consumer>
    {
      ({ activateAuth }) => (
        <>
          <RegisterMutation>
            {
              // A través de la técnica de render props le pasamos la mutación register
            (register) => {
              const onSubmit = ({ email, password }) => {
                // Estos valores de email y password se los pasamos como parámetro a onSubmit
                const input = { email, password };
                const variables = { input };
                register({ variables })
                  .then((activateAuth));
              };
              return <UserForm onSubmit={onSubmit} title="Registrarse" />;
            }
          }
          </RegisterMutation>
          <UserForm onSubmit={activateAuth} title="Iniciar sesión" />
        </>
      )
    }
  </Context.Consumer>
);

```

El formulario quedaría así:

```js
// src/components/UserForm/index.js

import React from 'react';
import { useInputValue } from '../../hooks/useInputValue';
import {
  Form, Input, Button, Title,
} from './styles';

export const UserForm = ({ onSubmit, title }) => {
  const email = useInputValue('');
  const password = useInputValue('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      email: email.value,
      password: password.value,
    });
  };

  return (
    <>
      <Title>{title}</Title>
      <Form onSubmit={handleSubmit}>
        <Input placeholder="Email" {...email} />
        <Input placeholder="Password" type="password" {...password} />
        <Button type="submit">{title}</Button>
      </Form>
    </>
  );
};

```

## Registro y login usando useContext

Vamos a cambiar las render props y vamos a usar en su lugar el hook ```useContext```. De modos que nuestro Context lo exportaríamos así:

```js
// src/Context.js

import React, { createContext, useState } from 'react';

// Exportamos el contexto así para poder usarlo con useContext en cualquier componente
export const Context = createContext();

const Provider = ({ children }) => {
  // También hemos añadido el session storage para que persistan los datos si el usuario se ha logado con anterioridad
  const [isAuth, setIsAuth] = useState(() => window.sessionStorage.getItem('token'));

  const value = {
    isAuth,
    activateAuth: (token) => {
      setIsAuth(true);
      window.sessionStorage.setItem('token', token);
    },
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default {
  Provider,
  Consumer: Context.Consumer,
};

```

Y lo usaremos así cuando queramos ese context. Este es el ejemplo del NotRegisteredUser.js

```js
// src/pages/NotRegisteredUser.js

import React, { useContext } from 'react';
import { Context } from '../Context';
import { UserForm } from '../components/UserForm';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { useLoginMutation } from '../hooks/useLoginMutation';

export const NotRegisteredUser = () => {
  const { activateAuth } = useContext(Context);
  const [
    register,
    { data: registerData, loading: registerLoading, error: registerError },
  ] = useRegisterMutation();
  const [
    login,
    { data: loginData, loading: loginLoading, error: loginError },
  ] = useLoginMutation();

  const onSignup = ({ email, password }) => {
    const input = { email, password };
    const variables = { input };
    register({ variables })
      .then(({ data }) => {
        const { signup: signupResponse } = data;
        activateAuth(signupResponse);
      })
      /* eslint-disable-next-line no-console */
      .catch((e) => console.warn('Error trying to register the user: ', e));
  };

  const onLogin = ({ email, password }) => {
    const input = { email, password };
    const variables = { input };
    login({ variables })
      .then(({ data }) => {
        const { login: loginResponse } = data;
        activateAuth(loginResponse);
      })
      /* eslint-disable-next-line no-console */
      .catch((e) => console.warn('Error trying to login: ', e));
  };

  return (
    <>
      <UserForm
        disabled={registerLoading}
        errorMsg={registerError && 'El usuario ya existe o hay algún problema con el registro.'}
        onSubmit={onSignup}
        title="Registrarse"
      />
      <UserForm
        disabled={loginLoading}
        errorMsg={loginError && 'No existe el usuario o la contraseña es incorrecta.'}
        onSubmit={onLogin}
        title="Iniciar sesión"
      />
    </>
  );
};

```

## Gestionando JWT

**¿Qué son los JWT?**

Es un estándar abierto para crear tokens y que el envío de datos se pueda hacer de forma segura.

Es decir, que por ejemplo un usuario si no tiene ese token no pueda dar like a alguna foto ni cambiar datos en la base de datos almacenada.

El token consta de tres partes:

De ```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4YjQ2ODAwLTBkM2QtMTFlYi04ZGU2LTZmM2Q5ZDQxZTY4MSIsImVtYWlsIjoicHJ1ZWJhQGVtYWlsLmNvbSIsImlhdCI6MTYwMjU4NTE0NywiZXhwIjoxNjAyNjcxNTQ3fQ.BI5ULPkj9X9czufU70KCC6sq1kgdPd3Jc2SNWekDmS8```.

* Header: un objeto que define qué algoritmo y tipo tiene el token

```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.```

* Payload: un objeto con la información que estamos enviando (name, etc)

```eyJpZCI6ImQ4YjQ2ODAwLTBkM2QtMTFlYi04ZGU2LTZmM2Q5ZDQxZTY4MSIsImVtYWlsIjoicHJ1ZWJhQGVtYWlsLmNvbSIsImlhdCI6MTYwMjU4NTE0NywiZXhwIjoxNjAyNjcxNTQ3fQ.```

* La firma

```BI5ULPkj9X9czufU70KCC6sq1kgdPd3Jc2SNWekDmS8```

Todo esto está totalmente encriptado

**¿Cómo lo usamos?**

Vamos a cambiar primero la mutación que teníamos anónima, para ya no sea anónima:

```js
// src/hooks/useToggleLikeMutation.js

import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';

// Hemos cambiado esta mutación
const LIKE_PHOTO = gql`
  mutation likePhoto($input: LikePhoto!){
    likePhoto(input: $input) {
      id,
      liked,
      likes
    }
  }
`;

export const useToggleLikeMutation = (id) => {
  const [toggleLike] = useMutation(LIKE_PHOTO, { variables: { input: { id } } });
  return { toggleLike };
};
```

Ahora tenemos que modificar nuestro punto de entrada a la aplicación (Index.js) para que antes de hacer las peticiones a la base de datos de graphql, compruebe el token

```js
// src/Index.js

import React from 'react';
import ReactDOM from 'react-dom';
// La utilidad que nos permite hacer la conexión fácilmente
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Context from './Context';

import App from './App';

const client = new ApolloClient({
  uri: 'https://petgram-api-server.vercel.app/graphQL',
  // Tenemos que añadir una nueva propiedad request, que es una función
  // que como parámetro va a recibir la operación que está realizando
  // Es lo que se va a ejecutar justo antes de hacer cualquier petición al servidor
  request: (operation) => {
    const token = window.sessionStorage.getItem('token');
    const authorization = token ? `Bearer ${token}` : '';
    operation.setContext({
      headers: {
        authorization,
      },
    });
  },
});

ReactDOM.render(
  // Accedemos al componente provider y
  // en value especificamos todos los valores que queremos que tenga el árbol accesible
  <Context.Provider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Context.Provider>, document.getElementById('app'),
);

```

Y ahora tenemos que cambiar donde se usa para que ya no recupere la información del session storage, sino que nos va a llegar por props los likes almacenados para el usuario x (ya que esa información está en la base de datos)

```js
// src/components/Photocard/index.js

import React from 'react';
import { Link } from '@reach/router';
import { useNearScreen } from '../../hooks/useNearScreen';
import { useToggleLikeMutation } from '../../hooks/useToggleLikeMutation';
import { FavButton } from '../FavButton';
import {
  Article, ImgWrapper, Img,
} from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({
  id, liked, likes = 0, src = DEFAULT_IMAGE,
}) => {
  const [show, element] = useNearScreen();
  const { toggleLike } = useToggleLikeMutation(id);

  // Hemos eliminado todo lo del session storage
  const handleFavClick = () => {
    toggleLike();
  };

  return (
    <Article ref={element}>
      {
        show
        && (
        <>
          <Link to={`/detail/${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </Link>
          <FavButton liked={liked} likes={likes} onClick={handleFavClick} />

        </>
        )

      }
    </Article>
  );
};

```

**Asegurarnos de no tener problemas si el token expira**

Como los token pueden expirar, vamos a manejar ese escenario y vamos a añadir una nueva propiedad al cliente de apollo

```js
// src/Index,js

// ...
const client = new ApolloClient({
  uri: 'https://petgram-api-server.vercel.app/graphQL',
  request: (operation) => {
    const token = window.sessionStorage.getItem('token');
    const authorization = token ? `Bearer ${token}` : '';
    operation.setContext({
      headers: {
        authorization,
      },
    });
  },
  // Añadimos otra propiedad onError, para manejar errores
  onError: (error) => {
    const { networkError } = error;
    if (networkError && networkError.result.code === 'invalid_token') {
      // Eliminamos el token que está mal
      window.sessionStorage.removeItem('token');
      // Y le enviamos a la página de registro
      window.location.href = '/user';
    }
  },
});
// ...
```

## Acceder a los datos de un usario registrado

Vamos a hacerlo con el hook useQuery, para ello creamos nuestro custom hook useGetFavsQuery:

```js
// src/hooks/useGetFavsQuery.js

import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

const GET_FAVS = gql`
  query getFavs {
    favs {
      id
      categoryId
      src
      likes
      userId
    }
  }
`;

export const useGetFavsQuery = () => {
  const { loading, error, data } = useQuery(GET_FAVS, {
    // añadimos esta propiedad para que cuando le damos a un like y nos movemos a nuestra página de favs, se refresque y tome los datos tanto del servidor como de la caché, si no, se quedaría con la caché por defecto y no veríamos los cambios
    fetchPolicy: 'cache-and-network',
  });
  return {
    loading, error, data,
  };
};
```

Ahora usaríamos esta petición en el contenedor ListOfFavs

```js
// src/containers/ListOfFavs.js

import React from 'react';
import { useGetFavsQuery } from '../hooks/useGetFavsQuery';
import { ListOfFavsComponent } from '../components/ListOfFavs';

export const ListOfFavs = () => {
  const { loading, error, data } = useGetFavsQuery();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const { favs } = data;
  return (
    <ListOfFavsComponent favs={favs} />
  );
};
```

Y esto lo importaríamos en la página de favoritos:

```js
// src/pages/Favs.js

import React from 'react';
import { ListOfFavs } from '../containers/ListOfFavs';
import { HeadingH1 } from '../components/HeadingH1';

export const Favs = () => (
  <>
    <HeadingH1>Favs</HeadingH1>
    <ListOfFavs />
  </>
);
```

## Logout

Ya sólo nos queda añadir el logout de la página, para lo cual, vamos a añadir un nuevo método en el ```Provider``` del ```Context```:

```js
// src/Context.js

import React, { createContext, useState } from 'react';

export const Context = createContext();

const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => window.sessionStorage.getItem('token'));

  const value = {
    isAuth,
    activateAuth: (token) => {
      setIsAuth(true);
      window.sessionStorage.setItem('token', token);
    },
    // Añadimos este método para poder hacer logout desde cualquier lado de la aplicación
    removeAuth: () => {
      setIsAuth(false);
      window.sessionStorage.removeItem('token');
    },
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default {
  Provider,
  Consumer: Context.Consumer,
};

```

Y lo usamos por ejemplo en la página de ```User```:

```js
// src/pages/User.js

import React, { useContext } from 'react';
import { Context } from '../Context';
import { HeadingH1 } from '../components/HeadingH1';
import { SubmitButton } from '../components/SubmitButton';

export const User = () => {
  const { removeAuth } = useContext(Context);
  return (
    <>
      <HeadingH1>User</HeadingH1>
      <SubmitButton onClick={removeAuth}>Cerrar Sesión</SubmitButton>
    </>
  );
};

```

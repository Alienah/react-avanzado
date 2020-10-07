# REACT AVANZADO

# Fetching de datos con GraphQl y React Apollo

## GraphQl

Es un lenguaje creado por facebook que nos permite recuperar únicamente los datos que necesitamos

1. Describe tus datos

Especificando por ejemplo qué tipo tiene y que se puedan hacer las validaciones tanto en cliente como en servidor

2. Pide lo que quieras

Con lo cual, optimizas los recursos

3. Obtienes resultados predecibles

**Diferencias con REST api**

Importante recalcar que NO sustituye a REST, ya que son cosas diferentes.

**GraphQL** es un lenguaje que permite conectarse, no sólo a REST api, sino a cualquier api.

**REST** es una arquitectura.

**GraphQL** nos proporciona 1 solo endpoint desde el que recuperaremos lo que necesitemos

**REST**, sin embargo nos proporciona múltiples endpoints

**GraphQL**, nos permite hacer fetching de justo lo que necesitamos

**REST** a veces nos proporciona demasiada información con el fetch y a veces, escasa, de forma que tenemos que hacer varias consultas para obtener lo que queremos.

**GraphQL**, podemos hacer una conexión a otras apis

**REST**, normalmente tendremos una conexión directa con la base de datos

## Apollo

Es un cliente que nos permite conectarnos a un servidor de GraphQL

## React Apollo

Es el mismo cliente, pero que tiene las conexiones que se ajustan perfectamente a la biblioteca de React, así se puede integrar más fácilmente. 

## Instalación

```bash
npm install apollo-boost react-apollo graphql
```

Apollo boost, es una utilidad que nos permite establecer una conexión con un servidor de apollo y sin configuración

React-apollo, es la integración de apollo con React 

## Cómo se usa

Y ahora en nuestro punto de entrada a nuestra aplicación inicializamos el cliente,

```js
// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
// La utilidad que nos permite hacer la conexión fácilmente
import ApolloClient from 'apollo-boost';
// ApolloProvider nos permite envolver nuestra aplicación,
// de manera que podamos acceder desde cualquier sitio a las funcionalidades de apollo
import { ApolloProvider } from 'react-apollo';

import App from './App';

const client = new ApolloClient({
  // Le pasamos esta configuración, formada por:
  // la url donde tenemos nuestro servidor de graphQL
  // Con este enlacepodemos acceder al playground de graphQL en el que podemos probar
  uri: 'https://wowgram-api.vercel.app/graphQL',
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, document.getElementById('app'),
);
```
Ahora que lo tenemos disponible en la aplicación, podemos usarlo por ejemplo en nuestro componente ListOfPhotoCards

```js
// src/components/ListOfPhotoCards/index.js

import React from 'react';
import { graphql } from 'react-apollo';
// Nos permite hacer las queries como si fuese un string y que apollo lo entienda
import { gql } from 'apollo-boost';
import { PhotoCard } from '../PhotoCard';

// Hacemos la query con graphql y creamos esta función de orden superior "withPhotos"
const withPhotos = graphql(gql`
  query getPhotos {
    photos {
      id
      categoryId
      src
      likes
      liked
      userId
    }
  }
`);

// Con esta función "withPhotos" vamos a envolver nuestro componente y generar uno nuevo
// Por eso es de orden superior, porque:
// usaremos como parámetro una función(en este caso componente)
// y además nos devuelve otro componente (que es una función) con mejoras

// Le hemos cambiado el nombre porque ya no vamos a exportra esto
const ListOfPhotoCardsComponent = ({ data: { photos = [] } }) => (
  <ul>
    {photos.map((photo) => (
      <li key={photo.id}>
        <PhotoCard {...photo} />
      </li>
    ))}
  </ul>
);

export const ListOfPhotoCards = withPhotos(ListOfPhotoCardsComponent);

```

## Filtrando resultados

Siguiendo el ejemplo anterios, ahora ya recibimos todas las fotos en nuestro componente ListOfPhotoCards, sin embargo, queremos filtrar por si son perros, gatos, etc. Esto en la base de datos de nuestra aplicación tiene en su estructura un categoryId, que es el que nos ayudará a filtrar. 

¿Cómo lo hacemos en la query?

```js
// src/components/ListOfPhotoCards/index.js

// ...
// Añadimos a la query el parámetro categoryId, para que nos filtre por categoría
const withPhotos = graphql(gql`
  query getPhotos($categoryId: ID) {
    photos(categoryId: $categoryId) {
      id
      categoryId
      src
      likes
      liked
      userId
    }
  }
`);

// ...

export const ListOfPhotoCards = withPhotos(ListOfPhotoCardsComponent);

```

Con lo que ahora al componente le podemos especificar un valor concretor para la prop "categoryId" (Recordemos que nuestra función withPhotos recibe un componente como parámetro y devuelve otro componente con unas props, que son los datos de la base de datos, y entre los que está categoryId)

Por ejemplo lo haríamos así en el sitio donde se instancia el componente ListOfPhotoCards, la App:

```js
// src/App.js

// ...
const App = () => (
  <div>
    <GlobalStyle />
    <Logo />
    <ListOfCategories />
    <ListOfPhotoCards categoryId={2} />
  </div>
);

export default App;

```

## HOC (High Order Components) - Patrón

Ahora que tenemos una función de orden superior, lo correcto sería extraerla en una carpeta, ya que queremos seprar la lógica de la vista

Creamos una carpeta hoc, en la que vamos a crear poner nuestro primer hoc:

```js
// src/hoc/withPhotos.js

import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

// Añadimos a la query el parámetro categoryId, para que nos filtre por categoría
export const withPhotos = graphql(gql`
  query getPhotos($categoryId: ID) {
    photos(categoryId: $categoryId) {
      id
      categoryId
      src
      likes
      liked
      userId
    }
  }
`);

// Con esta función "withPhotos" vamos a envolver nuestro componente y generar uno nuevo
// Por eso es de orden superior, porque:
// usaremos como parámetro una función(en este caso componente)
// y además nos devuelve otro componente (que es una función) con mejoras

```

Y el componente que lo usa, quedaría así:

```js
// src/components/ListOfPhotoCards/index.js

import React from 'react';
import { withPhotos } from '../../hoc/withPhotos';
import { PhotoCard } from '../PhotoCard';

const ListOfPhotoCardsComponent = ({ data: { photos = [] } }) => (
  <ul>
    {photos.map((photo) => (
      <li key={photo.id}>
        <PhotoCard {...photo} />
      </li>
    ))}
  </ul>
);

export const ListOfPhotoCards = withPhotos(ListOfPhotoCardsComponent);
```

## Separando container y components

También podríamos ir separando la lógica de negocio o container de lo presentacional

De modo que el componente quedaría así:

```js
// src/components/ListOfPhotoCards/index.js

import React from 'react';
import { PhotoCard } from '../PhotoCard';

export const ListOfPhotoCardsComponent = ({ data: { photos = [] } }) => (
  <ul>
    {photos.map((photo) => (
      <li key={photo.id}>
        <PhotoCard {...photo} />
      </li>
    ))}
  </ul>
);
```

Y el container así:

```js
// src/containers/ListOfPhotoCards.js

import { withPhotos } from '../hoc/withPhotos';
import { ListOfPhotoCardsComponent } from '../components/ListOfPhotoCards';

export const ListOfPhotoCards = withPhotos(ListOfPhotoCardsComponent);

```

Y este container es el que se importaría en App

```js
// src/App.js

// ...
import { ListOfPhotoCards } from './containers/ListOfPhotoCards';
// ...

const App = () => (
  <div>
   {
    //  ...
   }
    <ListOfPhotoCards categoryId={2} />
  </div>
);

export default App;

```

## Render Props - Patrón

Este patrón lo que hace es convertir la prop especial _children_ y, en lugar de renderizar un elemento (como haríamos normalmente), lo que va a renderizar es una función.

Esta función por tanto lo que devuelve es el componente que queremos renderizar.

La utilidad de las render props, en la función Children, es que podemos especificar, a través de los parámetros que recibe esta función,  qué información de graphql queremos inyectar en ese componente que vamos a renderizar.

Vamos a ver un ejemplo.

En nuestro proyecto, vamos a cambiar el componente PhotoCard y vamos a hacer que el enlace en vez de ser ```/detail/${id}``` sea una query string (con ? e =):

```js
// src/components/PhotoCard/index.js

// ...
<a href={`/?detail=${id}`}>
  <ImgWrapper>
    <Img src={src} alt="" />
  </ImgWrapper>
</a>
// ...
```

Esto nos va a servir para identificar si estamos navegando a un detalle.

¿Cómo podemos detectar eso?

Nos vamos a App y accedemos a la url para obtener ese detail

```js
// App.js

import React from 'react';
import { GlobalStyle } from './styles/GlobalStyles';
import { ListOfCategories } from './components/ListOfCategories';
import { ListOfPhotoCards } from './containers/ListOfPhotoCards';
import { Logo } from './components/Logo';

const App = () => {
  // URLSearchParams recibe un parámetro, que va a ser la query string
  const urlParams = new window.URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');
  console.log(urlParams, detailId);
  return (
    <div>
      <GlobalStyle />
      <Logo />
      {
        // Si hay un detailId, se renderiza otro contenido con el detailId,
        // en caso contrario, se ven las listas completas
        detailId
          ? <h1>Detail id {detailId}</h1>
          : (
            <>
              <ListOfCategories />
              <ListOfPhotoCards categoryId={2} />
            </>
          )
      }
    </div>
  );
};

export default App;
```

Ahora vamos a ir un poco más allá, porque lo que queremos es que al hacer click en ese enlace, se muestre la query que queremos, para ello vamos a crear un nuevo container PhotoCardWithQuery, que es donde vamos a usar el método de render props.

```js
// src/container/PhotoCardWithQuery.js

import React from 'react';
import { gql } from 'apollo-boost';
// Query es lo que nos va a permitir usar la técnica de render props
import { Query } from 'react-apollo';
import { PhotoCard } from '../components/PhotoCard';

const query = gql`
  query getSinglePhoto($id:ID!) {
    photo(id:$id) {
      id
      categoryId
      src
      likes
      liked
      userId
    }
  }
`;

export const PhotoCardWithQuery = ({ id }) => (
  <Query query={query} variables={{ id }}>
    {
      // Recordemos que con las render props no renderizamos un componente directamente,
      // sino una función que devuelve un componente
      ({ loading, error, data }) => {
        if (loading) return null;
        const { photo } = data;
        return <PhotoCard {...photo} />;
      }

    }
  </Query>
);

```

Y en la App, lo importamos pasándole por props la id del detail que queremos buscar

```js
// App.js

// ...
import { PhotoCardWithQuery } from './containers/PhotoCardWithQuery';
// ...

const App = () => {
  // URLSearchParams recibe un parámetro, que va a ser la query string
  const urlParams = new window.URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');

  return (
    <div>
      {
        // ...
        detailId
          ? <PhotoCardWithQuery id={detailId} />
          : (
            <>
              <ListOfCategories />
              <ListOfPhotoCards categoryId={2} />
            </>
          )
      }
    </div>
  );
};

export default App;
```

_Como ejercicio, podríamos convertir el HOC que hicimos antes con esta técnica_

## Buenas prácticas

* Nombres descriptivos: En vez de llamar ```query```, poner nombres más descriptivos como ```GET_SINGLE_PHOTO```.

* Tratar el estado de ```loading``` y de ```error```

* Extraer la función de render props

```js
// PhotoCardWithQuery.js

import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { PhotoCard } from '../components/PhotoCard';

const GET_SINGLE_PHOTO = gql`
  query getSinglePhoto($id:ID!) {
    photo(id:$id) {
      id
      categoryId
      src
      likes
      liked
      userId
    }
  }
`;

const renderProp = ({ loading, error, data }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const { photo } = data;
  return <PhotoCard {...photo} />;
};

export const PhotoCardWithQuery = ({ id }) => (
  <Query query={GET_SINGLE_PHOTO} variables={{ id }}>
    {renderProp}
  </Query>
);
```

# Enviando datos a la base de datos

Vamos a hacer que se almacene en la base de datos el like cuando hacemos click (de momento para un usuario anónimo)

Creamos un container encargado de hacer mutaciones (que es lo que hace que se muten los valores almacenados enla base de datos)

Extraemos el botón de va a un componente aparte

```js
// src/components/FavButton/index.js

import React from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { Button } from './styles';

export const FavButton = ({ liked, likes, onClick }) => {
  const Icon = liked ? MdFavorite : MdFavoriteBorder;
  return (
    <Button onClick={onClick} type="button">
      <Icon size="32px" />{likes} likes!
    </Button>
  );
};
```

```js
// src/components/FavButton/styles.js

import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  padding-top: 8px;
  & svg {
    margin-right: 4px;
  }
`;
```

Creamos nuestro container mutador

```js
// src/containers/ToggleLikeMutation.js

import React from 'react';
import { gql } from 'apollo-boost';
import { Mutation } from 'react-apollo';

const LIKE_PHOTO = gql`
  mutation likeAnonymousPhoto($input: LikePhoto!){
    likeAnonymousPhoto(input: $input) {
      id,
      liked,
      likes
    }
  }
`;

// Usamos children porque nos va a permitir usar esta mutación en cualquier componente
export const ToggleLikeMutation = ({ children }) => (
  <Mutation mutation={LIKE_PHOTO}>
    {children}
  </Mutation>
);
```

Y en PhotoCard importamos esa mutación y el favButton y usamos esa mutación para wrappear nuestro FavButton a través de render Props, para poder inyectar dicha mutación y que al hacer click se modifique la base de datos.

```js
// src/components/PhotoCard/index.js

import React from 'react';
import { useMutation } from 'react-apollo';
import { useNearScreen } from '../../hooks/useNearScreen';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ToggleLikeMutation } from '../../containers/ToggleLikeMutation';
import { FavButton } from '../FavButton';
import {
  Article, ImgWrapper, Img,
} from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({ id, likes = 0, src = DEFAULT_IMAGE }) => {
  const [show, element] = useNearScreen();
  const key = `like-${id}`;
  const [liked, setLiked] = useLocalStorage(key, false);

  return (
    <Article ref={element}>
      {
        // Si está en el viewPort se renderiza
        show
        && (
        <>
          <a href={`/?detail=${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </a>
          <ToggleLikeMutation>
            {
              // usamos el favButton como children en la render Prop
              // Usamos renderProp porque queremos inyectar cosas
              // como parámetro a esta función le va a llegar la mutación que queremos realizar
              (toggleLike) => {
                const handleFavClick = () => {
                  if (!liked) toggleLike({ variables: { input: { id } } });
                  setLiked(!liked);
                };
                return <FavButton liked={liked} likes={likes} onClick={handleFavClick} />;
              }
            }
          </ToggleLikeMutation>

        </>
        )

      }
    </Article>
  );
};

```

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

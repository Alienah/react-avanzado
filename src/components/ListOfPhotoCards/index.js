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

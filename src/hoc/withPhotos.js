import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

// Añadimos a la query el parámetro categoryId, para que nos filtre por categoría si queremos
const GET_PHOTOS = gql`
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
`;

export const withPhotos = graphql(GET_PHOTOS);

// Con esta función "withPhotos" vamos a envolver nuestro componente y generar uno nuevo
// Por eso es de orden superior, porque:
// usaremos como parámetro una función(en este caso componente)
// y además nos devuelve otro componente (que es una función) con mejoras

// Solution with render props instead usegetFavsQuery

import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ListOfFavsComponent } from '../components/ListOfFavs';

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

const renderProp = ({ loading, error, data }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const { favs } = data;
  return <ListOfFavsComponent favs={favs} />;
};

export const FavsWithQuery = () => (
  // Añadimos fetchPolicy network-only como solución
  // para que vaya siempre a la red para recuperar la información,
  // en vez de usar la caché por defecto
  <Query query={GET_FAVS} fetchPolicy="network-only">
    {renderProp}
  </Query>
);

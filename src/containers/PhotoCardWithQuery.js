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

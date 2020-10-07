import React from 'react';
import { gql } from 'apollo-boost';
// Query es lo que nos va a permitir usar la técnica de render props
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

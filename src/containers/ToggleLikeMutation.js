// Solution with render props instead useToggleLikeMutation

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

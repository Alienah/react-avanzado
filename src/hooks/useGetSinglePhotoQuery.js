import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

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

export const useGetSinglePhotoQuery = (id) => {
  const { loading, error, data } = useQuery(GET_SINGLE_PHOTO, {
    variables: { id },
  });
  return {
    loading, error, data,
  };
};

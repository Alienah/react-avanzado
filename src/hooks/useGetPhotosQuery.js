import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

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

export const useGetPhotosQuery = (categoryId) => {
  const { loading, error, data } = useQuery(GET_PHOTOS, {
    variables: { categoryId },
  });
  return {
    loading, error, data,
  };
};

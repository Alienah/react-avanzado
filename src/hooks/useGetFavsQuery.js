import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo';

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

export const useGetFavsQuery = () => {
  const { loading, error, data } = useQuery(GET_FAVS, {
    fetchPolicy: 'cache-and-network',
  });
  return {
    loading, error, data,
  };
};

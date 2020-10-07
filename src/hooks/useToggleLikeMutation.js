import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';

const LIKE_PHOTO = gql`
  mutation likeAnonymousPhoto($input: LikePhoto!){
    likeAnonymousPhoto(input: $input) {
      id,
      liked,
      likes
    }
  }
`;

export const useToggleLikeMutation = (id) => {
  const [toggleLike] = useMutation(LIKE_PHOTO, { variables: { input: { id } } });
  return { toggleLike };
};

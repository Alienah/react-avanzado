import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';

const LOGIN = gql`
  mutation login($input: UserCredentials!) {
    login(input: $input)
  }
`;

export const useLoginMutation = () => {
  const [login, { data, loading, error }] = useMutation(LOGIN);
  return [login, { data, loading, error }];
};

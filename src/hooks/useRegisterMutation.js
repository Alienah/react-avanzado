import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';

const REGISTER = gql`
  mutation signup($input: UserCredentials!) {
    signup(input: $input)
  }
`;

export const useRegisterMutation = () => {
  const [register, { data, loading, error }] = useMutation(REGISTER);

  return [register, { data, loading, error }];
};

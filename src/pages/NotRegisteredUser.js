import React, { useContext } from 'react';
import { Context } from '../Context';
import { UserForm } from '../components/UserForm';
import { useRegisterMutation } from '../hooks/useRegisterMutation';
import { useLoginMutation } from '../hooks/useLoginMutation';

export const NotRegisteredUser = () => {
  const { activateAuth } = useContext(Context);
  const [
    register,
    { data: registerData, loading: registerLoading, error: registerError },
  ] = useRegisterMutation();
  const [
    login,
    { data: loginData, loading: loginLoading, error: loginError },
  ] = useLoginMutation();

  const onSignup = ({ email, password }) => {
    const input = { email, password };
    const variables = { input };
    register({ variables })
      .then((activateAuth))
      /* eslint-disable-next-line no-console */
      .catch((e) => console.warn('Error trying to register the user: ', e));
  };

  const onLogin = ({ email, password }) => {
    const input = { email, password };
    const variables = { input };
    login({ variables })
      .then((activateAuth))
      /* eslint-disable-next-line no-console */
      .catch((e) => console.warn('Error trying to register the user: ', e));
  };

  return (
    <>
      <UserForm
        disabled={registerLoading}
        errorMsg={registerError && 'El usuario ya existe o hay algún problema con el registro.'}
        onSubmit={onSignup}
        title="Registrarse"
      />
      <UserForm
        disabled={loginLoading}
        errorMsg={loginError && 'No existe el usuario o la contraseña es incorrecta.'}
        onSubmit={onLogin}
        title="Iniciar sesión"
      />
    </>
  );
};

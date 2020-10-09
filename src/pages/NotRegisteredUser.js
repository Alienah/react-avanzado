import React from 'react';
import Context from '../Context';
import { UserForm } from '../components/UserForm';
import { useRegisterMutation } from '../hooks/useRegisterMutation';

export const NotRegisteredUser = () => {
  const [register, { data, loading, error }] = useRegisterMutation();

  return (
    // Usamos el consumer, ya que lo que queremos es acceder a los datos
    // El consumer lo que recibe es una render prop
    <Context.Consumer>
      {
        ({ activateAuth }) => {
          let errorMsg;
          if (error) {
            errorMsg = error && 'El usuario ya existe o hay algún problema con el registro.';
          }
          const onSubmit = ({ email, password }) => {
            const input = { email, password };
            const variables = { input };
            register({ variables })
              .then((activateAuth))
              /* eslint-disable-next-line no-console */
              .catch((e) => console.warn('Error trying to register the user: ', e));
          };
          return (
            <>
              <UserForm
                disabled={loading}
                errorMsg={errorMsg}
                onSubmit={onSubmit}
                title="Registrarse"
              />
              <UserForm onSubmit={activateAuth} title="Iniciar sesión" />
            </>
          );
        }
    }
    </Context.Consumer>
  );
};

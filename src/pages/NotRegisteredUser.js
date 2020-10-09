import React from 'react';
import Context from '../Context';
import { UserForm } from '../components/UserForm';
import { RegisterMutation } from '../containers/RegisterMutation';

export const NotRegisteredUser = () => (
  // Usamos el consumer, ya que lo que queremos es acceder a los datos
  // El consumer lo que recibe es una render prop
  <Context.Consumer>
    {
      ({ activateAuth }) => (
        <>
          <RegisterMutation>
            {
            (register) => {
              const onSubmit = ({ email, password }) => {
                // Estos valores de email y password se los pasamos como parámetro a onSubmit
                const input = { email, password };
                const variables = { input };
                register({ variables })
                  .then((activateAuth));
              };
              return <UserForm onSubmit={onSubmit} title="Registrarse" />;
            }
          }
          </RegisterMutation>
          <UserForm onSubmit={activateAuth} title="Iniciar sesión" />
        </>
      )
    }
  </Context.Consumer>
);

import React from 'react';
import Context from '../Context';
import { UserForm } from '../components/UserForm';

export const NotRegisteredUser = () => (
  // Usamos el consumer, ya que lo que queremos es acceder a los datos
  // El consumer lo que recibe es una render prop
  <Context.Consumer>
    {
      ({ activateAuth }) => (
        <>
          <UserForm onSubmit={activateAuth} title="Registrarse" />
          <UserForm onSubmit={activateAuth} title="Iniciar sesión" />
        </>
      )
    }
  </Context.Consumer>
);

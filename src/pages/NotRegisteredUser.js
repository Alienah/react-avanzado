import React from 'react';
import Context from '../Context';

export const NotRegisteredUser = () => (
  // Usamos el consumer, ya que lo que queremos es acceder a los datos
  // El consumer lo que recibe es una render prop
  <Context.Consumer>
    {
      ({ activateAuth }) => (
        <form onSubmit={activateAuth}>
          <button type="submit">Iniciar sesión</button>
        </form>
      )
    }
  </Context.Consumer>
);

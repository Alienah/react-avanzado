import React, { createContext, useState } from 'react';

export const Context = createContext();

// Vamos a modificar el componente Provider
// y le añadimos un estado para saber si está autentificado o no
// Y esto, como se puede apreciar lo hacemos con la ténica de render props
const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => window.sessionStorage.getItem('token'));

  // Esto es lo que vamos a pasarle como prop al Provider.
  // Con lo cual, es el que vamos a poder acceder desde toda la aplicación
  const value = {
    isAuth,
    activateAuth: (token) => {
      setIsAuth(true);
      window.sessionStorage.setItem('token', token);
    },
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export default {
  Provider,
  Consumer: Context.Consumer,
};

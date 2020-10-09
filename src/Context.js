import React, { createContext, useState } from 'react';

const Context = createContext();

// Vamos a modificar el componente Provider
// y le añadimos un estado para saber si está autentificado o no
// Y esto, como se puede apreciar lo hacemos con la ténica de render props
const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  // Esto es lo que vamos a pasarle como prop al Provider.
  // Con lo cual, es el que vamos a poder acceder desde toda la aplicación
  const value = {
    isAuth,
    activateAuth: () => {
      setIsAuth(true);
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

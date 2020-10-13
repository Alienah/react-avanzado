import React from 'react';
import ReactDOM from 'react-dom';
// La utilidad que nos permite hacer la conexión fácilmente
import ApolloClient from 'apollo-boost';
// ApolloProvider nos permite envolver nuestra aplicación,
// de manera que podamos acceder desde cualquier sitio a las funcionalidades de apollo
import { ApolloProvider } from 'react-apollo';
// Igual que el ApolloProvider, el Context también tiene que wrappear la aplicación,
// para poder tener acceso a él desde cualquier sitio.
import Context from './Context';

import App from './App';

const client = new ApolloClient({
  // Le pasamos esta configuración, formada por:
  // la url donde tenemos nuestro servidor de graphQL
  // Con este enlacepodemos acceder al playground de graphQL en el que podemos probar
  uri: 'https://petgram-api-server.vercel.app/graphQL',
  // Tenemos que añadir una nueva propiedad request, que es una función
  // que como parámetro va a recibir la operación que está realizando
  // Es lo que se va a ejecutar justo antes de hacer cualquier petición al servidor
  request: (operation) => {
    const token = window.sessionStorage.getItem('token');
    const authorization = token ? `Bearer ${token}` : '';
    operation.setContext({
      headers: {
        authorization,
      },
    });
  },
  // Añadimos otra propiedad onError, para manejar errores
  onError: (error) => {
    const { networkError } = error;
    if (networkError && networkError.result.code === 'invalid_token') {
      // Eliminamos el token que está mal
      window.sessionStorage.removeItem('token');
      // Y le enviamos a la página de inicio de sesión
      window.location.href = '/user';
    }
  },
});

ReactDOM.render(
  // Accedemos al componente provider y
  // en value especificamos todos los valores que queremos que tenga el árbol accesible
  <Context.Provider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Context.Provider>, document.getElementById('app'),
);

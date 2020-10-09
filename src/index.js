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
